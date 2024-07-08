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
        <a :href="safeDownloadLink" download="compressed.pdf" class="button download-messagee">Download Compressed PDF</a>
        <button @click="doAnotherConversion" class="button another-conversion-button">Do Another Conversion</button>
      </div>
    </div>
  </div>
</template>


<script>
import { compressPDF } from '../helpers/PdfHelper';
import { PdfData, CompressionState } from '../models/pdf/PdfModel';

export default {
  data() {
    const uploadedPdf = new PdfData();
    return {
      state: uploadedPdf.filestate,
      file: uploadedPdf.selectedFileMetadata,
      downloadLink: uploadedPdf.downloadLink,
      compressionLevel: uploadedPdf.compressionLevel
    };
  },
  computed: {
    safeDownloadLink() {
      return this.isValidUrl(this.downloadLink) ? this.downloadLink : '';
    }
  },
  methods: {
    onFileChange(event) {
      try {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
          const url = window.URL.createObjectURL(file);
          const size = (file.size / 1024).toFixed(2); // Size in KB
          this.file = { filename: file.name, url, size };
          this.state = CompressionState.FILE_SELECTED;
        } else {
          this.file = null;
          alert('Please upload a valid PDF file.');
        }
      } catch (error) {
        console.error('Error handling file change:', error);
        alert('An error occurred while processing the file.');
      }
    },
    onDrop(event) {
      try {
        const file = event.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
          const url = window.URL.createObjectURL(file);
          const size = (file.size / 1024).toFixed(2); // Size in KB
          this.file = { filename: file.name, url, size };
          this.state = CompressionState.FILE_SELECTED;
        } else {
          this.file = null;
          alert('Please upload a valid PDF file.');
        }
      } catch (error) {
        console.error('Error handling file drop:', error);
        alert('An error occurred while processing the file.');
      }
    },
    async onSubmit(event) {
      event.preventDefault();
      if (this.file) {
        const { filename, url } = this.file;
        this.state = CompressionState.COMPRESSION_IN_PROGRESS;
        try {
          await this.beginCompression(url, filename, this.compressionLevel);
        } catch (error) {
          console.error('Error during compression:', error);
          alert('An error occurred during compression. Please try again.');
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
        console.error('Error in beginCompression:', error);
        throw error; // Rethrow to handle in onSubmit
      }
    },
    async handleCompressionCompletion(element) {
      try {
        this.state = CompressionState.READY_FOR_DOWNLOAD;
        const { pdfURL } = await this.getPdfDownloadLink(element);
        if (this.isValidUrl(pdfURL)) {
          this.downloadLink = pdfURL;
        } else {
          console.error('Invalid download link:', pdfURL);
          this.downloadLink = '';
        }
      } catch (error) {
        console.error('Error completing compression:', error);
        alert('An error occurred while completing the compression.');
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
        console.error('Error getting download link:', error);
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
    }
  }
};
</script>

<style scoped src="../assets/styles/DocumentStyles.css"></style>
