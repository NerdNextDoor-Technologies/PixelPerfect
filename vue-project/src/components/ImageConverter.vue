<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar">
      <a href="#" class="navbar-brand">Image App</a>
      <ul class="navbar-nav">
        <li class="nav-item"><a href="#" class="nav-link" @click.prevent="navigate('LandingPage')">Home</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Features</a></li>
      </ul>
    </nav>

    <div class="content">
      <div v-if="!isImageLoaded" class="upload-container">
        <div class="drag-drop-area" @drop.prevent="handleFileDrop" @dragover.prevent>
          <label class="upload-label">
            <input type="file" @change="handleFileSelection" accept="image/*" :disabled="appStateInstance.isDownloading">
            <span class="button">Select Image</span>
          </label>
          <p>or drag and drop an image here</p>
        </div>
      </div>

      <div v-if="isImageLoaded" class="image-details">
        <p><strong>Selected File:</strong> {{ imageModelInstance.currentFileName }}</p>
        <p>Current Dimensions: <span>{{ imageModelInstance.currentWidth }}</span> x <span>{{ imageModelInstance.currentHeight }}</span></p>
        <p>Current Size: <span>{{ (imageModelInstance.currentFileSize / 1048576).toFixed(2) }}</span> MB</p>
      </div>

      <div v-if="appStateInstance.showResizeFields" class="resize-fields">
        <label for="targetWidth">Width:</label>
        <input type="number" v-model="imageModelInstance.targetWidth" class="input-width" placeholder="Enter target width" @input="updateDimensions('width')">
        <p v-if="errorMessages.width" class="error">{{ errorMessages.width }}</p>
        <label for="targetHeight">Height:</label>
        <input type="number" v-model="imageModelInstance.targetHeight" class="input-height" placeholder="Enter target height" @input="updateDimensions('height')">
        <p v-if="errorMessages.height" class="error">{{ errorMessages.height }}</p>
        <label>
          <input type="checkbox" v-model="appStateInstance.keepAspectRatio"> Keep Aspect Ratio
        </label>
        <div class="buttons">
          <button @click="resizeImage" :disabled="appStateInstance.isDownloading || hasValidationErrors || appStateInstance.buttonsDisabled || !isImageLoaded" :class="{ blurred: appStateInstance.buttonsDisabled }">Submit</button>
          <button @click="resetImageForm" :disabled="appStateInstance.isDownloading || appStateInstance.buttonsDisabled || !isImageLoaded" :class="{ blurred: appStateInstance.buttonsDisabled }">Go Back</button>
        </div>
      </div>

      <div v-else-if="isImageLoaded" class="initial-options">
        <button @click="showResizeFields" :disabled="appStateInstance.isDownloading || appStateInstance.buttonsDisabled" :class="{ blurred: appStateInstance.buttonsDisabled }">Resize Image</button>
        <label for="sizeOptions">Reduce Image Size:</label>
        <select v-model="selectedSize" @change="reduceSizeImage" :disabled="appStateInstance.isDownloading || appStateInstance.buttonsDisabled" :class="{ blurred: appStateInstance.buttonsDisabled }">
          <option value="" disabled>Select a size</option>
          <option value="512000">500 KB</option>
          <option value="1048576">1 MB</option>
          <option value="2097152">2 MB</option>
          <option value="3145728">3 MB</option>
        </select>
      </div>
      <canvas ref="canvas" style="display:none;"></canvas>
      <p v-if="appStateInstance.isDownloading" class="downloading-message">Downloading... please wait</p>
      <p v-if="appStateInstance.errorMessage" class="error">{{ appStateInstance.errorMessage }}</p>
    </div>
  </div>
</template>


<script>
import { ImageData, Errors, AppState } from '../models/image/ImageModel.js';
import { resizeImage, reduceImageToSize } from '../helpers/ImageHelper.js';

export default {
  data() {
    return {
      imageModelInstance: new ImageData(),
      errorMessages: new Errors(),
      appStateInstance: new AppState(),
      selectedSize: '',
      lastModifiedDimension: ''
    };
  },
  computed: {
    hasValidationErrors() {
      return this.errorMessages.width !== '' || this.errorMessages.height !== '';
    },
    isImageLoaded() {
      return !!this.imageModelInstance.currentImageSrc;
    }
  },
  methods: {
    handleFileSelection(event) {
      const file = event.target.files[0];
      if (!file) {
        this.displayErrorMessage("No file selected.");
        return;
      }
      this.imageModelInstance.loadImage(file, this.displayErrorMessage.bind(this), this.updateState.bind(this));
    },
    handleFileDrop(event) {
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.imageModelInstance.loadImage(files[0], this.displayErrorMessage.bind(this), this.updateState.bind(this));
      }
    },
    updateState(currentDimensionsVisible, buttonsDisabled) {
      this.appStateInstance.currentDimensionsVisible = currentDimensionsVisible;
      this.appStateInstance.buttonsDisabled = buttonsDisabled;
    },
    validateTargetDimensions() {
      const width = this.imageModelInstance.targetWidth;
      const height = this.imageModelInstance.targetHeight;
      this.errorMessages.width = width <= 0 ? "Width must be greater than 0." : '';
      this.errorMessages.height = height <= 0 ? "Height must be greater than 0." : '';
      if (width * height > 25600000) {
        this.errorMessages.width = "The product of width and height must not exceed 25,600,000.";
        this.errorMessages.height = "The product of width and height must not exceed 25,600,000.";
      }
    },
    keepAspectRatio(dimension) {
      if (!this.appStateInstance.keepAspectRatio || !this.imageModelInstance.currentWidth || !this.imageModelInstance.currentHeight) return;

      if (dimension === 'width') {
        const aspectRatio = this.imageModelInstance.currentHeight / this.imageModelInstance.currentWidth;
        this.imageModelInstance.targetHeight = Math.round(this.imageModelInstance.targetWidth * aspectRatio);
      } else if (dimension === 'height') {
        const aspectRatio = this.imageModelInstance.currentWidth / this.imageModelInstance.currentHeight;
        this.imageModelInstance.targetWidth = Math.round(this.imageModelInstance.targetHeight * aspectRatio);
      }
    },
    updateDimensions(dimension) {
      this.lastModifiedDimension = dimension;
      if (this.appStateInstance.keepAspectRatio) {
        this.keepAspectRatio(dimension);
      }
      this.validateTargetDimensions();
    },
    resizeImage() {
      const img = new Image();
      img.src = this.imageModelInstance.currentImageSrc;
      img.onload = () => {
        const targetWidth = this.imageModelInstance.targetWidth || img.width;
        const targetHeight = this.imageModelInstance.targetHeight || (img.height / img.width) * targetWidth;

        this.imageModelInstance.validateResolution(targetWidth, targetHeight, this.displayErrorMessage.bind(this));
        if (!this.imageModelInstance.isValid) return;

        try {
          const resizedImageURL = resizeImage(img, this.imageModelInstance.targetWidth, this.imageModelInstance.targetHeight);
          this.createDownloadLinkAndTriggerDownload(resizedImageURL, 'resized-image.jpg');
          this.appStateInstance.currentDimensionsVisible = false;
        } catch (error) {
          this.displayErrorMessage(error.message);
        }
      };
    },
    reduceSizeImage() {
      if (!this.selectedSize) {
        this.displayErrorMessage("Please select a size.");
        return;
      }
      const img = new Image();
      img.src = this.imageModelInstance.currentImageSrc;
      img.onload = () => {
        const targetWidth = img.width;
        const targetHeight = img.height;

        this.imageModelInstance.validateResolution(targetWidth, targetHeight, this.displayErrorMessage.bind(this));
        if (!this.imageModelInstance.isValid) return;

        try {
          const reducedImageURL = reduceImageToSize(img, parseInt(this.selectedSize));
          this.createDownloadLinkAndTriggerDownload(reducedImageURL, `reduced-size-image-${this.selectedSize}.jpg`);
        } catch (error) {
          this.displayErrorMessage(error.message);
        }
      };
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
      this.appStateInstance.currentDimensionsVisible = true;
    },
    resetImageForm() {
      this.appStateInstance.showResizeFields = false;
      this.imageModelInstance.targetWidth = null;
      this.imageModelInstance.targetHeight = null;
      this.appStateInstance.errorMessage = '';
      this.appStateInstance.currentDimensionsVisible = true;
      this.appStateInstance.buttonsDisabled = false;
    },
    displayErrorMessage(message) {
      this.appStateInstance.errorMessage = message;
      this.appStateInstance.buttonsDisabled = true;
    },
  },
};
</script>


<style scoped src="../assets/styles/ImageStyles.css"></style>
