<template>
  <div id="app">
    <h1>Image Resizer</h1>
    <input type="file" @change="onFileChange" accept="image/*" :disabled="appState.isDownloading"><br>
    <div v-if="imageData.currentImageSrc">
      <p>Current Dimensions: <span>{{ imageData.currentWidth }}</span> x <span>{{ imageData.currentHeight }}</span></p>
      <p>Current Size: <span>{{ (imageData.currentFileSize / 1048576).toFixed(2) }}</span> MB</p>
    </div>
    <div v-if="appState.showResizeFields">
      <label for="targetWidth">Width:</label>
      <input type="number" v-model="imageData.targetWidth" class="input-width" placeholder="Enter target width" @input="onDimensionInput('width')"><br>
      <p v-if="errors.width" class="error">{{ errors.width }}</p>
      <label for="targetHeight">Height:</label>
      <input type="number" v-model="imageData.targetHeight" class="input-height" placeholder="Enter target height" @input="onDimensionInput('height')"><br>
      <p v-if="errors.height" class="error">{{ errors.height }}</p>
      <label>
        <input type="checkbox" v-model="appState.keepAspectRatio"> Keep Aspect Ratio
      </label><br>
      <button @click="resizeImage" :disabled="appState.isDownloading || hasValidationErrors">Submit</button><br>
      <button @click="resetForm" :disabled="appState.isDownloading">Go Back</button>
    </div>
    <div v-else>
      <button @click="appState.showResizeFields = true" :disabled="appState.isDownloading">Resize Image</button><br>
      <label for="sizeOptions">Reduce Image Size:</label>
      <select v-model="selectedSize" @change="submitReduceToSelectedSize" :disabled="appState.isDownloading">
        <option value="" disabled>Select a size</option>
        <option value="512000">500 KB</option>
        <option value="1048576">1 MB</option>
        <option value="2097152">2 MB</option>
        <option value="3145728">3 MB</option>
      </select><br>
    </div>
    <canvas ref="canvas" style="display:none;"></canvas>
    <p v-if="appState.isDownloading" class="downloading-message">Downloading... please wait</p>
    <p v-if="appState.errorMessage" class="error">{{ appState.errorMessage }}</p>
  </div>
</template>




<script>

import { imageData, Errors, AppState } from './models/image/ImageModel.js';
import { resizeImage, reduceImageToSize } from './helpers/ImageHelper.js';

let canvas;

export default {
  data() {
    return {
      imageData: new imageData(),
      errors: new Errors(),
      appState: new AppState(),
      selectedSize: ''
    };
  },
  computed: {
    hasValidationErrors() {
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
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this.imageData.currentWidth = img.width;
          this.imageData.currentHeight = img.height;
          this.imageData.currentImageSrc = e.target.result;
          this.imageData.currentFileSize = file.size;
          this.appState.currentDimensionsVisible = true;
        };
        img.onerror = () => {
          this.displayError("Invalid image file.");
        };
        img.src = e.target.result;
      };
      reader.onerror = () => {
        this.displayError("Error reading file.");
      };
      reader.readAsDataURL(file);
    },
    validateImageDimensions() {
      const width = this.imageData.targetWidth;
      const height = this.imageData.targetHeight;
      this.errors.width = width <= 0 ? "Width must be greater than 0." : '';
      this.errors.height = height <= 0 ? "Height must be greater than 0." : '';
      if (width * height > 25600000) {
        this.errors.width = "The product of width and height must not exceed 25,600,000.";
        this.errors.height = "The product of width and height must not exceed 25,600,000.";
      }
    },
    onDimensionInput(dimension) {
      if (!this.appState.keepAspectRatio || !this.imageData.currentWidth || !this.imageData.currentHeight) return;

      if (dimension === 'width') {
        const aspectRatio = this.imageData.currentHeight / this.imageData.currentWidth;
        this.imageData.targetHeight = Math.round(this.imageData.targetWidth * aspectRatio);
      } else if (dimension === 'height') {
        const aspectRatio = this.imageData.currentWidth / this.imageData.currentHeight;
        this.imageData.targetWidth = Math.round(this.imageData.targetHeight * aspectRatio);
      }
      this.validateImageDimensions();
    },
    resizeImage() {
      const img = new Image();
      img.src = this.imageData.currentImageSrc;
      img.onload = () => {
        const targetWidth = this.imageData.targetWidth || img.width;
        const targetHeight = this.imageData.targetHeight || (img.height / img.width) * targetWidth;
        
        this.imageData.validateResolution(targetWidth, targetHeight, this.displayError.bind(this));
        if (!this.imageData.isValid) return;

        try {
          canvas = document.createElement('canvas');
          const resizedImageURL = resizeImage(img, this.imageData.targetWidth, this.imageData.targetHeight);
          this.downloadImage(resizedImageURL, 'resized-image.jpg');
        } catch (error) {
          this.displayError(error.message);
        }
      };
    },
    submitReduceToSelectedSize() {
      if (!this.selectedSize) {
        this.displayError("Please select a size.");
        return;
      }
      const img = new Image();
      img.src = this.imageData.currentImageSrc;
      img.onload = () => {
        const targetWidth = img.width;
        const targetHeight = img.height;

        this.imageData.validateResolution(targetWidth, targetHeight, this.displayError.bind(this));
        if (!this.imageData.isValid) return;

        try {
          canvas = document.createElement('canvas');
          const reducedImageURL = reduceImageToSize(img, parseInt(this.selectedSize));
          this.downloadImage(reducedImageURL, `reduced-size-image-${this.selectedSize}.jpg`);
        } catch (error) {
          this.displayError(error.message);
        }
      };
    },
    downloadImage(dataURL, fileName) {
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
    resetForm() {
      this.appState.showResizeFields = false;
      this.imageData.targetWidth = null;
      this.imageData.targetHeight = null;
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

select {
  margin-top: 10px;
  padding: 5px;
  width: 215px;
}

.downloading-message {
  color: green;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}

label input[type="checkbox"] {
  margin-left: 5px;
}
</style>


