<template>
  <div id="app">
    <h1>PDF Compressor</h1>
    <form @submit="onSubmit">
      <input type="file" @change="onFileChange" />
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
        this.begincompression(url, filename, this.compressionLevel);
      }
    },
    begincompression(url, filename, compressionLevel) {
      compressPDF(
        url,
        filename,
        compressionLevel,
        this.handleCompressionCompletion,
        this.ShowProgress,
        this.ShowStatusUpdate
      );
    },
    handleCompressionCompletion(element) {
      this.state = States.TO_BE_DOWNLOADED;
      this.getPdfDownloadLink(element).then(({ pdfURL }) => {
        this.downloadLink = pdfURL;
      });
    },
    ShowProgress(...args) {
      console.log('Compression Progress:', JSON.stringify(args));
    },
    ShowStatusUpdate(element) {
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