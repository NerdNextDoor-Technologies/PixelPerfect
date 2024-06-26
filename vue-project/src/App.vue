<template>
  <div id="app">
    <h1>PDF Compressor</h1>
    <form @submit="onSubmit">
      <input type="file" @change="changeHandler" />
      <select v-model="compressionLevel">
        <option value="low">Low Compression</option>
        <option value="medium">Medium Compression</option>
        <option value="high">High Compression</option>
      </select>
      <button type="submit">Compress PDF</button>
    </form>
    <div v-if="state === 'loading'">Compressing...</div>
    <a v-if="state === 'toBeDownloaded'" :href="downloadLink" download="compressed.pdf">Download Compressed PDF</a>
  </div>
</template>

<script>

import { compressPDF } from './helpers/PdfHelper';
import { PdfData, States } from './models/pdf/PdfModel';


export default {
  data() {
    const uploaded_pdf = new PdfData();
    return {
      state: uploaded_pdf.state,
      file: uploaded_pdf.file,
      downloadLink: uploaded_pdf.downloadLink,
      compressionLevel: uploaded_pdf.compressionLevel
    };
  },
  methods: {
    changeHandler(event) {
      const file = event.target.files[0];
      if (file) {
        const url = window.URL.createObjectURL(file);
        this.file = { filename: file.name, url };
        this.state = States.SELECTED;
      }
    },
    onSubmit(event) {
      event.preventDefault();
      if (this.file) {
        const { filename, url } = this.file;
        this.state = States.LOADING;
        this.beginPdfcompression(url, filename, this.compressionLevel);
      }
    },
    beginPdfcompression(url, filename, compressionLevel) {
      compressPDF(
        url,
        filename,
        compressionLevel,
        this.handleCompressionCompletion,
        this.handleCompressionProgress,
        this.handleCompressionStatusUpdate
      );
    },
    handleCompressionCompletion(element) {
      this.state = States.TO_BE_DOWNLOADED;
      this.getPdfDownloadLink(element).then(({ pdfURL }) => {
        this.downloadLink = pdfURL;
      });
    },
    handleCompressionProgress(...args) {
      console.log('Compression Progress:', JSON.stringify(args));
    },
    handleCompressionStatusUpdate(element) {
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

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
