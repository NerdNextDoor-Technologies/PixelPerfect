<template>
  <div id="app">
    <h1>Image Resizer</h1>
    <input type="file" @change="onFileChange" accept="image/*" :disabled="isDownloading"><br>
    <div v-if="currentDimensionsVisible">
      <p>Current Dimensions: <span>{{ currentWidth }}</span> x <span>{{ currentHeight }}</span></p>
    </div>
    <div v-if="showResizeFields">
      <label for="targetWidth">Width:</label>
      <input type="number" v-model="targetWidth" class="input-width" placeholder="Enter target width" @input="validateDimensions"><br>
      <p v-if="errors.width" class="error">{{ errors.width }}</p>
      <label for="targetHeight">Height:</label>
      <input type="number" v-model="targetHeight" class="input-height" placeholder="Enter target height" @input="validateDimensions"><br>
      <p v-if="errors.height" class="error">{{ errors.height }}</p>
      <button @click="submitResize" :disabled="isDownloading || hasErrors">Submit</button><br>
      <button @click="goBack" :disabled="isDownloading">Go Back</button>
    </div>
    <div v-else>
      <button @click="showResizeFields = true" :disabled="isDownloading">Resize Image</button><br>
      <button @click="submitReduceTo1MB" :disabled="isDownloading">Reduce Image Size to 1MB</button><br>
    </div>
    <canvas ref="canvas" style="display:none;"></canvas>
    <p v-if="isDownloading" class="downloading-message">Downloading... please wait</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>


<script>
export default {
  data() {
    return {
      currentDimensionsVisible: false,
      currentWidth: null,
      currentHeight: null,
      targetWidth: null,
      targetHeight: null,
      errorMessage: '',
      showResizeFields: false,
      currentImageSrc: '',
      isDownloading: false,
      errors: {
        width: '',
        height: ''
      }
    };
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
          this.currentDimensionsVisible = true;
          this.currentWidth = img.width;
          this.currentHeight = img.height;
          this.currentImageSrc = e.target.result;
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
    validateDimensions() {
      const width = parseInt(this.targetWidth);
      const height = parseInt(this.targetHeight);
      this.errors.width = width <= 0 ? "Width must be greater than 0." : '';
      this.errors.height = height <= 0 ? "Height must be greater than 0." : '';
      if (width * height > 25600000) {
        this.errors.width = "The product of width and height must not exceed 25,600,000.";
        this.errors.height = "The product of width and height must not exceed 25,600,000.";
      }
    },
    submitResize() {
      const img = new Image();
      img.src = this.currentImageSrc;
      img.onload = () => {
        const targetWidth = this.targetWidth ? parseInt(this.targetWidth) : img.width;
        const targetHeight = this.targetHeight ? parseInt(this.targetHeight) : (img.height / img.width) * targetWidth;

        if (!validateDimensions(targetWidth, targetHeight, (message) => this.displayError(message))) return;

        try {
          const canvas = this.$refs.canvas;
          const resizedImageURL = resizeImage(img, targetWidth, targetHeight, canvas);
          this.startDownload(resizedImageURL, 'resized-image.jpg');
        } catch (error) {
          this.displayError(error.message);
        }
      };
    },
    submitReduceTo1MB() {
      const img = new Image();
      img.src = this.currentImageSrc;
      img.onload = () => {
        if (!validateDimensions(img.width, img.height, (message) => this.displayError(message))) return;

        try {
          const canvas = this.$refs.canvas;
          const reducedImageURL = reduceImageTo1MB(img, canvas);
          this.startDownload(reducedImageURL, 'reduced-size-image.jpg');
        } catch (error) {
          this.displayError(error.message);
        }
      };
    },
    startDownload(dataURL, fileName) {
      this.isDownloading = true;
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        this.isDownloading = false;
      }, 2000); // Simulating a delay for the download process
    },
    goBack() {
      this.showResizeFields = false;
      this.targetWidth = null;
      this.targetHeight = null;
      this.errorMessage = '';
    },
    displayError(message) {
      this.errorMessage = message;
    }
  }
};

// Utility functions defined within the same file

function resizeImage(img, targetWidth, targetHeight, canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL('image/jpeg');
}

function reduceImageTo1MB(img, canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);

  let quality = 1.0;
  let resizedImageURL = canvas.toDataURL('image/jpeg', quality);
  while (resizedImageURL.length > 1 * 1024 * 1024 && quality > 0.1) {
    quality -= 0.1;
    resizedImageURL = canvas.toDataURL('image/jpeg', quality);
  }
  return resizedImageURL;
}

function validateDimensions(width, height, displayError) {
  const product = width * height;
  if (width <= 0) {
    displayError("The width cannot be negative or zero. Please enter a width greater than 0.");
    return false;
  }
  if (height <= 0) {
    displayError("The height cannot be negative or zero. Please enter a height greater than 0.");
    return false;
  }
  if (product > 25600000) {
    displayError("The product of width and height must not exceed 25,600,000. Please enter valid dimensions.");
    return false;
  }
  return true;
}
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
