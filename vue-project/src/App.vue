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
import { _GSPS2PDF } from './ghostscript-utils';

export default {
  data() {
    return {
      state: "init",
      file: undefined,
      downloadLink: undefined,
      compressionLevel: "low"
    };
  },
  methods: {
    changeHandler(event) {
      const file = event.target.files[0];
      const url = window.URL.createObjectURL(file);
      this.file = { filename: file.name, url };
      this.state = 'selected';
    },
    onSubmit(event) {
      event.preventDefault();
      const { filename, url } = this.file;
      this.compressPDF(url, filename, this.compressionLevel);
      this.state = "loading";
    },
    compressPDF(pdf, filename, compressionLevel) {
      const dataObject = { psDataURL: pdf };
      _GSPS2PDF(dataObject,
        (element) => {
          this.state = "toBeDownloaded";
          this.loadPDFData(element, filename).then(({ pdfURL }) => {
            this.downloadLink = pdfURL;
          });
        },
        (...args) => console.log("Progress:", JSON.stringify(args)),
        (element) => console.log("Status Update:", JSON.stringify(element)),
        compressionLevel
      );
    },
    loadPDFData(element, filename) {
      return new Promise((resolve) => {
        const link = document.createElement('a');
        link.href = element.pdfDataURL;
        link.download = filename;
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
