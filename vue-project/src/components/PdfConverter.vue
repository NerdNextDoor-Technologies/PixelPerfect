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
          <span class="button">Upload PDF</span>
          <input type="file" @change="onFileChange" />
        </label>
      </div>
      <div v-if="file" class="resize-fields">
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
      <a :href="safeDownloadLink" download="compressed.pdf" class="button">Download Compressed PDF</a>
      <button @click="doAnotherConversion" class="button another-conversion-button">Do Another Conversion</button>
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
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        const url = window.URL.createObjectURL(file);
        this.file = { filename: file.name, url };
        this.state = CompressionState.FILE_SELECTED;
      } else {
        this.file = null;
        alert('Please upload a valid PDF file.');
      }
    },
    onDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        const url = window.URL.createObjectURL(file);
        this.file = { filename: file.name, url };
        this.state = CompressionState.FILE_SELECTED;
      } else {
        this.file = null;
        alert('Please upload a valid PDF file.');
      }
    },
    onSubmit(event) {
      event.preventDefault();
      if (this.file) {
        const { filename, url } = this.file;
        this.state = CompressionState.COMPRESSION_IN_PROGRESS;
        this.beginCompression(url, filename, this.compressionLevel);
      }
    },
    beginCompression(url, filename, compressionLevel) {
      compressPDF(
        url,
        filename,
        compressionLevel,
        this.handleCompressionCompletion,
        this.showProgress,
        this.showStatusUpdate
      );
    },
    handleCompressionCompletion(element) {
      this.state = CompressionState.READY_FOR_DOWNLOAD;
      this.getPdfDownloadLink(element).then(({ pdfURL }) => {
        if (this.isValidUrl(pdfURL)) {
          this.downloadLink = pdfURL;
        } else {
          console.error('Invalid download link:', pdfURL);
          this.downloadLink = '';
        }
      });
    },
    showProgress(...args) {
      console.log('Compression Progress:', JSON.stringify(args));
    },
    showStatusUpdate(element) {
      console.log('Compression Status Update:', JSON.stringify(element));
    },
    getPdfDownloadLink(element) {
      return Promise.resolve({ pdfURL: element.pdfDataURL });
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

<style src="../assets/styles/PdfStyles.css"></style>
