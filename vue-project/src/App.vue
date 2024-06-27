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
      <div class="upload-container" @dragover.prevent @drop.prevent="onDrop">
        <label class="upload-label">
          <span>Drag and drop your PDF here</span>
          <span class="button">Upload PDF</span>
          <input type="file" @change="onFileChange" />
        </label>
      </div>
      <div v-if="file" class="resize-fields">
        <select v-model="compressionLevel" class="input-width">
          <option value="low">Low Compression</option>
          <option value="medium">Medium Compression</option>
          <option value="high">High Compression</option>
        </select>
        <div class="buttons">
          <button type="submit" class="compress-button">Compress PDF</button>
        </div>
      </div>
    </form>
    <div v-if="state === 'loading'" class="downloading-message">Compressing...</div>
    <a v-if="state === 'toBeDownloaded'" :href="downloadLink" download="compressed.pdf" class="button">Download Compressed PDF</a>
  </div>
</template>

<script>
import { compressPDF } from './helpers/PdfHelper';
import { PdfData, States } from './models/pdf/PdfModel';

export default {
  data() {
    const uploadedPdf = new PdfData();
    return {
      state: uploadedPdf.state,
      file: uploadedPdf.file,
      downloadLink: uploadedPdf.downloadLink,
      compressionLevel: uploadedPdf.compressionLevel
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        const url = window.URL.createObjectURL(file);
        this.file = { filename: file.name, url };
        this.state = States.SELECTED;
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
        this.state = States.SELECTED;
      } else {
        this.file = null;
        alert('Please upload a valid PDF file.');
      }
    },
    onSubmit(event) {
      event.preventDefault();
      if (this.file) {
        const { filename, url } = this.file;
        this.state = States.LOADING;
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
      this.state = States.TO_BE_DOWNLOADED;
      this.getPdfDownloadLink(element).then(({ pdfURL }) => {
        this.downloadLink = pdfURL;
      });
    },
    showProgress(...args) {
      console.log('Compression Progress:', JSON.stringify(args));
    },
    showStatusUpdate(element) {
      console.log('Compression Status Update:', JSON.stringify(element));
    },
    getPdfDownloadLink(element) {
      return new Promise((resolve) => {
        resolve({ pdfURL: element.pdfDataURL });
      });
    }
  }
};
</script>

<style src="./assets/styles/PdfStyles.css"></style>
