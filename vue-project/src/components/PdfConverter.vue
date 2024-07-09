<template>
  <div id="app">
    <nav class="navbar">
      <a href="#" class="navbar-brand">PDF Compressor</a>
      <ul class="navbar-nav">
        <li class="nav-item"><a href="#" class="nav-link">Home</a></li>
        <li class="nav-item"><a href="#" class="nav-link">About</a></li>
      </ul>
    </nav>
    <form @submit="onSubmit" class="form-container">
      <div v-if="!file" class="upload-container" @dragover.prevent @drop.prevent="onDrop">
        <label class="upload-label">
          <span>Drag and drop your PDF here</span>
          <span class="button upload">Upload PDF</span>
          <input type="file" @change="onFileChange" />
        </label>
      </div>
      <div v-if="file" class="resize-fields">
        <div class="file-info">
          <p>File Name: {{ file.filename }}</p>
          <p>File Size: {{ file.size }} KB</p>
        </div>
        <div v-if="approxTargetSize" class="approx-size">
          <p>Approx. Compressed Size of a Page: {{ approxTargetSize }} KB</p>
        </div>
        <select v-model="compressionLevel" class="input-width">
          <option value="LOW">Low Compression</option>
          <option value="MEDIUM">Medium Compression</option>
          <option value="HIGH">High Compression</option>
        </select>
        <div class="buttons">
          <button type="submit" class="compress-button">Compress PDF</button>
        </div>
      </div>
    </form>
    <div v-if="state === 'COMPRESSION_IN_PROGRESS'" class="downloading-message">Compressing...</div>
    <div v-if="state === 'READY_FOR_DOWNLOAD'" class="download-section">
      <div class="adjacent-container">
        <a :href="safeDownloadLink" download="compressed.pdf" class="button download-message">Download Compressed PDF</a>
        <button @click="doAnotherConversion" class="button another-conversion-button">Do Another Conversion</button>
      </div>
    </div>
  </div>
</template>

<script>
import { compressPDF } from '../helpers/PdfHelper';
import { PdfData, CompressionState } from '../models/pdf/PdfModel';
import { PDFDocument } from 'pdf-lib';

export default {
  data() {
    const uploadedPdf = new PdfData();
    return {
      state: uploadedPdf.filestate,
      file: uploadedPdf.selectedFileMetadata,
      downloadLink: uploadedPdf.downloadLink,
      compressionLevel: uploadedPdf.compressionLevel,
      approxTargetSize: null
    };
  },
  computed: {
    safeDownloadLink() {
      return this.isValidUrl(this.downloadLink) ? this.downloadLink : '';
    }
  },
  methods: {
    async onFileChange(event) {
      try {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
          const url = window.URL.createObjectURL(file);
          const size = (file.size / 1024).toFixed(2); // Size in KB
          this.file = { filename: file.name, url, size };
          this.state = CompressionState.FILE_SELECTED;
          await this.compressSinglePage(file);
        } else {
          this.resetFileState('Invalid file type. Please upload a PDF file.');
        }
      } catch (error) {
        this.handleError('An error occurred while processing the file.', error);
      }
    },
    async onDrop(event) {
      try {
        const file = event.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
          const url = window.URL.createObjectURL(file);
          const size = (file.size / 1024).toFixed(2); // Size in KB
          this.file = { filename: file.name, url, size };
          this.state = CompressionState.FILE_SELECTED;
          await this.compressSinglePage(file);
        } else {
          this.resetFileState('Invalid file type. Please upload a PDF file.');
        }
      } catch (error) {
        this.handleError('An error occurred while processing the file.', error);
      }
    },
    async compressSinglePage(file) {
  try {
    // Load the original PDF document
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Select a random page
    const numPages = pdfDoc.getPageCount();
    const randomPageIndex = Math.floor(Math.random() * numPages);

    // Copy the random page to a new PDF document
    const singlePagePdfDoc = await PDFDocument.create();
    const [copiedPage] = await singlePagePdfDoc.copyPages(pdfDoc, [randomPageIndex]);
    singlePagePdfDoc.addPage(copiedPage);

    // Save the single-page PDF to bytes
    const singlePagePdfBytes = await singlePagePdfDoc.save();
    
    // Create a blob and a URL for the single-page PDF
    const singlePageBlob = new Blob([singlePagePdfBytes], { type: 'application/pdf' });
    const singlePageUrl = window.URL.createObjectURL(singlePageBlob);
    
    // Compress the single-page PDF and get its size
    const compressedSinglePage = await this.compressAndFetchSize(singlePageUrl);
    this.approxTargetSize = (compressedSinglePage.size / 1024).toFixed(2); // Size in KB
  } catch (error) {
    this.handleError('An error occurred while compressing a single page.', error);
  }
}

,
    async compressAndFetchSize(singlePageUrl) {
      return new Promise((resolve, reject) => {
        compressPDF(singlePageUrl, 'singlePage.pdf', 'HIGH',this.handleCompressionCompletion,this.showProgress,this.showStatusUpdate, (response) => {
          const { pdfDataURL } = response;
          fetch(pdfDataURL)
            .then((res) => res.blob())
            .then((blob) => {
              resolve(blob);
            })
            .catch(reject);
        });
      });
    },
    async onSubmit(event) {
      event.preventDefault();
      if (this.file) {
        const { filename, url } = this.file;
        this.state = CompressionState.COMPRESSION_IN_PROGRESS;
        try {
          await this.beginCompression(url, filename, this.compressionLevel);
        } catch (error) {
          this.handleError('An error occurred during compression. Please try again.', error);
          this.state = CompressionState.FILE_SELECTED;
        }
      }
    },
    async beginCompression(url, filename, compressionLevel) {
      try {
        await compressPDF(
          url,
          filename,
          compressionLevel,
          this.handleCompressionCompletion,
          this.showProgress,
          this.showStatusUpdate
        );
      } catch (error) {
        this.handleError('An error occurred while initiating compression.', error);
        throw error;
      }
    },
    async handleCompressionCompletion(element) {
      try {
        this.state = CompressionState.READY_FOR_DOWNLOAD;
        const { pdfURL } = await this.getPdfDownloadLink(element);
        if (this.isValidUrl(pdfURL)) {
          this.downloadLink = pdfURL;
        } else {
          throw new Error('Invalid download link.');
        }
      } catch (error) {
        this.handleError('An error occurred while completing the compression.', error);
        this.state = CompressionState.FILE_SELECTED;
      }
    },
    showProgress(...args) {
      console.log('Compression Progress:', JSON.stringify(args));
    },
    showStatusUpdate(element) {
      console.log('Compression Status Update:', JSON.stringify(element));
    },
    async getPdfDownloadLink(element) {
      try {
        return Promise.resolve({ pdfURL: element.pdfDataURL });
      } catch (error) {
        this.handleError('An error occurred while retrieving the download link.', error);
        throw error;
      }
    },
    isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    },
    doAnotherConversion() {
      window.location.reload();
    },
    resetFileState(message) {
      this.file = null;
      alert(message);
    },
    handleError(userMessage, error) {
      console.error(userMessage, error);
      alert(userMessage);
    }
  }
};
</script>

<style scoped src="../assets/styles/DocumentStyles.css"></style>
