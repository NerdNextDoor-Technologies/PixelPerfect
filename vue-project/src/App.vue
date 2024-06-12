<template>
  <div id="app">
    <h1>PDF Resizer</h1>
    <input type="file" @change="handleFileSelection" accept="application/pdf" :disabled="appStateInstance.isDownloading"><br>
    <div v-if="pdfModelInstance.currentPdfSrc && appStateInstance.currentFileDetailsVisible">
      <p>Current Size: <span>{{ (pdfModelInstance.currentFileSize / 1048576).toFixed(2) }}</span> MB</p>
    </div>
    <div v-if="appStateInstance.showResizeFields">
      <label for="sizeOptions">Reduce PDF Size:</label>
      <select v-model="selectedSize" @change="reduceSizePdf" :disabled="appStateInstance.isDownloading || appStateInstance.buttonsDisabled || !isPdfLoaded" :class="{ blurred: appStateInstance.buttonsDisabled }">
        <option value="" disabled>Select a size</option>
        <option value="512000">500 KB</option>
        <option value="1048576">1 MB</option>
        <option value="2097152">2 MB</option>
        <option value="3145728">3 MB</option>
      </select><br>
      <p v-if="appStateInstance.errorMessage" class="error">{{ appStateInstance.errorMessage }}</p>
      <button @click="resetPdfForm" :disabled="appStateInstance.isDownloading || appStateInstance.buttonsDisabled || !isPdfLoaded" :class="{ blurred: appStateInstance.buttonsDisabled }">Go Back</button>
    </div>
    <div v-else>
      <button @click="showResizeFields" :disabled="appStateInstance.isDownloading || appStateInstance.buttonsDisabled || !isPdfLoaded" :class="{ blurred: appStateInstance.buttonsDisabled }">Resize PDF</button><br>
    </div>
    <p v-if="appStateInstance.isDownloading" class="downloading-message">Downloading... please wait</p>
    <p v-if="appStateInstance.errorMessage" class="error">{{ appStateInstance.errorMessage }}</p>
  </div>
</template>

<script>
import { PdfData, Errors, AppState } from './models/pdf/PdfModel.js';
import { reducePdfToSize } from './helpers/PdfHelper.js';
import './assets/styles/PdfStyles.css';

export default {
  data() {
    return {
      pdfModelInstance: new PdfData(),
      errorMessages: new Errors(),
      appStateInstance: new AppState(),
      selectedSize: ''
    };
  },
  computed: {
    isPdfLoaded() {
      return !!this.pdfModelInstance.currentPdfSrc;
    }
  },
  methods: {
    handleFileSelection(event) {
      const file = event.target.files[0];
      if (!file) {
        this.displayErrorMessage("No file selected.");
        return;
      }
      this.pdfModelInstance.loadPdf(file, this.displayErrorMessage.bind(this), this.updateState.bind(this));
    },
    updateState(currentFileDetailsVisible, buttonsDisabled) {
      this.appStateInstance.currentFileDetailsVisible = currentFileDetailsVisible;
      this.appStateInstance.buttonsDisabled = buttonsDisabled;
    },
    async reduceSizePdf() {
      if (!this.selectedSize) {
        this.displayErrorMessage("Please select a size.");
        return;
      }
      
      try {
        const reducedPdfURL = await reducePdfToSize(this.pdfModelInstance.currentPdfSrc, parseInt(this.selectedSize));
        this.createDownloadLinkAndTriggerDownload(reducedPdfURL, `reduced-size-pdf-${this.selectedSize}.pdf`);
      } catch (error) {
        this.displayErrorMessage(error.message);
      }
    },
    createDownloadLinkAndTriggerDownload(dataURL, fileName) {
      this.appStateInstance.isDownloading = true;
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        this.appStateInstance.isDownloading = false;
      }, 2000);
    },
    showResizeFields() {
      this.appStateInstance.showResizeFields = true;
      this.appStateInstance.currentFileDetailsVisible = true;
    },
    resetPdfForm() {
      this.appStateInstance.showResizeFields = false;
      this.selectedSize = '';
      this.appStateInstance.errorMessage = '';
      this.appStateInstance.currentFileDetailsVisible = true;
      this.appStateInstance.buttonsDisabled = false;
    },
    displayErrorMessage(message) {
      this.appStateInstance.errorMessage = message;
      this.appStateInstance.buttonsDisabled = true;
    },
  },
};
</script>

<style src="./assets/styles/PdfStyles.css"></style>
