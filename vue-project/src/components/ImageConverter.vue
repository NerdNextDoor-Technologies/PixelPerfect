<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar">
      <a href="#" class="navbar-brand">Image App</a>
      <ul class="navbar-nav">
        <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Features</a></li>
      </ul>
    </nav>

    <div class="content">
      <div v-if="!isImageLoaded" class="upload-container">
        <div class="drag-drop-area" @drop.prevent="handleFileDrop" @dragover.prevent>
          <label class="upload-label">
            <input type="file" @change="handleFileSelection" accept="image/*"
              :disabled="appStateInstance.isDownloading">
            <span class="button">Select Image</span>
          </label>
          <p>or drag and drop an image here</p>
        </div>
      </div>

      <div v-if="isImageLoaded" class="image-details">
        <p><strong>Selected File:</strong> {{ imageModelInstance.currentFileName }}</p>
        <p>Current Dimensions: <span>{{ imageModelInstance.currentResolution.width }}</span> x <span>{{
          imageModelInstance.currentResolution.height }}</span></p>
        <p>Current Size: <span>{{ (imageModelInstance.currentFileSize / 1048576).toFixed(2) }}</span> MB</p>
      </div>

      <div v-if="appStateInstance.showResizeFields" class="resize-fields">
        <label for="targetWidth">Width:</label>
        <input type="number" v-model="targetResolution.width" class="input-width" placeholder="Enter target width"
          @input="updateDimensions('width')">
        <p v-if="errorMessages.width" class="error">{{ errorMessages.width }}</p>
        <label for="targetHeight">Height:</label>
        <input type="number" v-model="targetResolution.height" class="input-height" placeholder="Enter target height"
          @input="updateDimensions('height')">
        <p v-if="errorMessages.height" class="error">{{ errorMessages.height }}</p>
        <label>
          <input type="checkbox" v-model="appStateInstance.keepAspectRatio"> Keep Aspect Ratio
        </label>
        <div class="buttons">
          <button @click="resizeImageByResolution"
            :disabled="appStateInstance.isDownloading || hasValidationErrors || appStateInstance.buttonsDisabled || !isImageLoaded"
            :class="{ blurred: appStateInstance.buttonsDisabled }">Submit</button>
          <button @click="resetImageForm"
            :disabled="appStateInstance.isDownloading || appStateInstance.buttonsDisabled || !isImageLoaded"
            :class="{ blurred: appStateInstance.buttonsDisabled }">Go Back</button>
        </div>
      </div>

      <div v-else-if="isImageLoaded" class="initial-options">
        <button class="resize-button" @click="showResizeFields"
          :disabled="appStateInstance.isDownloading || appStateInstance.buttonsDisabled"
          :class="{ blurred: appStateInstance.buttonsDisabled }">Resize Image</button>
        <label for="sizeOptions" class="reduce-size-label">Reduce Image Size:</label>
        <!-- //TODO Replace with a slider with option for text box -->
        <select v-model="selectedSize" @change="resizeImageByFileSize" class="reduce-size-select"
          :disabled="appStateInstance.isDownloading || appStateInstance.buttonsDisabled"
          :class="{ blurred: appStateInstance.buttonsDisabled }">
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
import { ImageData } from '@/models/image/ImageModel';
import { resizeImageByResolution, resizedImageByFileSize } from '../helpers/ImageHelper';
import { AppState } from '@/models/app/AppState';
import { Errors } from '@/models/image/ImageDimensionsErrorMessage';
import { ImageResolution } from '@/models/image/ImageResolution.js';

export default {
  data() {
    return {
      imageModelInstance: null,
      errorMessages: new Errors(),
      appStateInstance: new AppState(),
      selectedSize: '',
      lastModifiedDimension: '',
      targetResolution: new ImageResolution(1, 1)
    };
  },
  computed: {
    hasValidationErrors() {
      return this.errorMessages.width !== '' || this.errorMessages.height !== '';
    },
    isImageLoaded() {
      return !!this.imageModelInstance?.currentImageSrc;
    }
  },
  methods: {
    async handleFileSelection(event) {
      const file = event.target.files[0];
      if (!file) {
        this.displayErrorMessage("No file selected.");
        return;
      }

      try {
        this.imageModelInstance = await new ImageData(file);
        console.log(this.imageModelInstance.currentResolution);
        this.updateState(true, false);
      } catch (error) {
        this.displayErrorMessage(error.message || "An error occurred while loading the image.");
      }
    },
    async handleFileDrop(event) {
      event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];

        try {
          this.imageModelInstance = await new ImageData(file);
          this.updateState(true, false);
        } catch (error) {
          this.displayErrorMessage(error.message || "An error occurred while loading the image.");
        }
      }
    },

    updateState(currentDimensionsVisible, buttonsDisabled) {
      this.appStateInstance.currentDimensionsVisible = currentDimensionsVisible;
      this.appStateInstance.buttonsDisabled = buttonsDisabled;
    },
    //TODO Do this using HTML 5 validation
    validateTargetDimensions() {
      const width = this.targetResolution.width;
      const height = this.targetResolution.height;
      this.errorMessages.width = width <= 0 ? "Width must be greater than 0." : '';
      this.errorMessages.height = height <= 0 ? "Height must be greater than 0." : '';
      if (width * height > 25600000) {
        this.errorMessages.width = "The product of width and height must not exceed 25,600,000.";
        this.errorMessages.height = "The product of width and height must not exceed 25,600,000.";
      }
    },
    //TODO Move logic to ImageHelper as a reusable function
    keepAspectRatio(dimension) {
      // if (this.appStateInstance.keepAspectRatio)
      // {
      //   this.targetResolution=resizeResolutionKeepingAspectRatioSame(this.imageModelInstance.resolution, targetWidth,targetHeight);
      // };

      // resizeResolutionKeepingAspectRatioSame(currentResolution,targetWidth):ImageResolution;
      // resizeResolutionKeepingAspectRatioSame(currentResolution,targetHeight):ImageResolution;
      // resizeResolutionKeepingAspectRatioSame(currentResolution,targetWidth,targetHeight):ImageResolution;
      if (dimension === 'width') {
        const aspectRatio = this.imageModelInstance.currentResolution.height / this.imageModelInstance.currentResolution.width;
        this.targetResolution.height = Math.round(this.targetResolution.width * aspectRatio);
      } else if (dimension === 'height') {
        const aspectRatio = this.imageModelInstance.currentResolution.width / this.imageModelInstance.currentResolution.height;
        this.targetResolution.width = Math.round(this.targetResolution.height * aspectRatio);
      }
    },
    //TODO Dimension should be an enum
    updateDimensions(dimension) {
      this.lastModifiedDimension = dimension;
      if (this.appStateInstance.keepAspectRatio) {
        this.keepAspectRatio(dimension);
      }
      this.validateTargetDimensions();
    },
    resizeImageByResolution() {
      const img = new Image();
      img.src = this.imageModelInstance.currentImageSrc;
      img.onload = () => {
        try {
          const resizedImageURL = resizeImageByResolution(img, this.targetResolution);
          this.createDownloadLinkAndTriggerDownload(resizedImageURL, 'resized-image.jpg');
          this.appStateInstance.currentDimensionsVisible = false;
        } catch (error) {
          this.displayErrorMessage(error.message);
        }
      };
    },
    resizeImageByFileSize() {
      if (!this.selectedSize) {
        this.displayErrorMessage("Please select a size.");
        return;
      }
      const img = new Image();
      img.src = this.imageModelInstance.currentImageSrc;
      img.onload = () => {
        try {
          const reducedImageURL = resizedImageByFileSize(img, parseInt(this.selectedSize));
          this.createDownloadLinkAndTriggerDownload(reducedImageURL, `reduced-size-image-${this.selectedSize}.jpg`);
        } catch (error) {
          this.displayErrorMessage(error.message || "An error occurred while reducing the image size.");
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
      this.targetWidth = null;
      this.targetHeight = null;
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
