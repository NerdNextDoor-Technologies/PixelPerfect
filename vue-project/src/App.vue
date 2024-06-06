<template>
  <div id="app">
    <h1>Image Resizer</h1>
    <input type="file" @change="onFileChange" accept="image/*" :disabled="appState.isDownloading"><br>
    <div v-if="imageProperties.currentDimensionsVisible">
      <p>Current Dimensions: <span>{{ imageProperties.currentWidth }}</span> x <span>{{ imageProperties.currentHeight }}</span></p>
    </div>
    <div v-if="appState.showResizeFields">
      <label for="targetWidth">Width:</label>
      <input type="number" v-model="imageProperties.targetWidth" class="input-width" placeholder="Enter target width" @input="validateDimensions"><br>
      <p v-if="errors.width" class="error">{{ errors.width }}</p>
      <label for="targetHeight">Height:</label>
      <input type="number" v-model="imageProperties.targetHeight" class="input-height" placeholder="Enter target height" @input="validateDimensions"><br>
      <p v-if="errors.height" class="error">{{ errors.height }}</p>
      <button @click="submitResize" :disabled="appState.isDownloading || hasErrors">Submit</button><br>
      <button @click="goBack" :disabled="appState.isDownloading">Go Back</button>
    </div>
    <div v-else>
      <button @click="appState.showResizeFields = true" :disabled="appState.isDownloading">Resize Image</button><br>
      <button @click="submitReduceTo1MB" :disabled="appState.isDownloading">Reduce Image Size to 1MB</button><br>
    </div>
    <canvas ref="canvas" style="display:none;"></canvas>
    <p v-if="appState.isDownloading" class="downloading-message">Downloading... please wait</p>
    <p v-if="appState.errorMessage" class="error">{{ appState.errorMessage }}</p>
  </div>
</template>



<script>

import { ImageProperties, Errors, AppState } from '../models/image/ImageModels.js';

import { resizeImage, reduceImageTo1MB, validateDimensions } from '../helpers/UtilityFunctions.js';


let canvas;

export default {
  data() {
    return {
      imageProperties: new ImageProperties(),
      errors: new Errors(),
      appState: new AppState(),
    };
  },
  computed: {
    hasErrors() {
      return this.errors.width !== '' || this.errors.height !== '';
    }
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (!file) {
        this.displayError("No file selected.");
        return;
      }
      this.imageProperties = new ImageProperties(file);
      this.appState.currentDimensionsVisible = true;
    },
    validateDimensions() {
      const width = this.imageProperties.targetWidth;
      const height = this.imageProperties.targetHeight;
      this.errors.width = width <= 0 ? "Width must be greater than 0." : '';
      this.errors.height = height <= 0 ? "Height must be greater than 0." : '';
      if (width * height > 25600000) {
        this.errors.width = "The product of width and height must not exceed 25,600,000.";
        this.errors.height = "The product of width and height must not exceed 25,600,000.";
      }
    },
    submitResize() {
      const img = new Image();
      img.src = this.imageProperties.currentImageSrc;
      img.onload = () => {
        const targetWidth = this.imageProperties.targetWidth || img.width;
        const targetHeight = this.imageProperties.targetHeight || (img.height / img.width) * targetWidth;
        if (!validateDimensions(targetWidth, targetHeight, (message) => this.displayError(message))) return;
        try {
          canvas = document.createElement('canvas');
          const resizedImageURL = resizeImage(img, targetWidth, targetHeight);
          this.startDownload(resizedImageURL, 'resized-image.jpg');
        } catch (error) {
          this.displayError(error.message);
        }
      };
    },
    submitReduceTo1MB() {
      const img = new Image();
      img.src = this.imageProperties.currentImageSrc;
      img.onload = () => {
        if (!validateDimensions(img.width, img.height, (message) => this.displayError(message))) return;
        try {
          canvas = document.createElement('canvas');
          const reducedImageURL = reduceImageTo1MB(img);
          this.startDownload(reducedImageURL, 'reduced-size-image.jpg');
        } catch (error) {
          this.displayError(error.message);
        }
      };
    },
    startDownload(dataURL, fileName) {
      this.appState.isDownloading = true;
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        this.appState.isDownloading = false;
      }, 2000);
    },
    goBack() {
      this.appState.showResizeFields = false;
      this.imageProperties.targetWidth = null;
      this.imageProperties.targetHeight = null;
      this.appState.errorMessage = '';
    },
    displayError(message) {
      this.appState.errorMessage = message;
    },
  },
};

</script>

<style>
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: Arial, sans-serif;
  margin: 20px;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h1 {
  margin-bottom: 20px;
}

label {
  margin-top: 10px;
}

.input-width {
  margin-left: 5px;
  margin-bottom: 10px;
  padding: 5px;
  width: 200px;
}

.input-height {
  margin-bottom: 10px;
  padding: 5px;
  width: 200px;
}

button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.downloading-message {
  color: green;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
