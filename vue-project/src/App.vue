<template>
  <div id="app">
    <h1>PDF Compressor</h1>
    <form @submit.prevent="onSubmit">
      <input type="file" @change="changeHandler" />
      <button type="submit" :disabled="state === 'loading'">Compress PDF</button>
    </form>
    <div v-if="state === 'toBeDownloaded'">
      <a :href="downloadLink" download="compressed.pdf">Download Compressed PDF</a>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { _GSPS2PDF } from './ghostscript-utils';

export default {
  setup() {
    const state = ref("init");
    const file = ref(undefined);
    const downloadLink = ref(undefined);

    function changeHandler(event) {
      const selectedFile = event.target.files[0];
      const url = window.URL.createObjectURL(selectedFile);
      file.value = { filename: selectedFile.name, url };
      state.value = 'selected';
    }

    function onSubmit() {
      const { filename, url } = file.value;
      compressPDF(url, filename);
      state.value = "loading";
    }

    function compressPDF(pdf, filename) {
      const dataObject = { psDataURL: pdf };
      _GSPS2PDF(
        dataObject,
        (element) => {
          console.log(element);
          state.value = "toBeDownloaded";
          loadPDFData(element, filename).then(({ pdfURL }) => {
            downloadLink.value = pdfURL;
          });
        },
        (...args) => console.log("Progress:", JSON.stringify(args)),
        (element) => console.log("Status Update:", JSON.stringify(element))
      );
    }

    async function loadPDFData(element, filename) {
      const response = await fetch(element.pdfDataURL);
      const blob = await response.blob();
      const pdfURL = window.URL.createObjectURL(blob);
      return { pdfURL };
    }

    return {
      state,
      changeHandler,
      onSubmit,
      downloadLink,
    };
  },
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
