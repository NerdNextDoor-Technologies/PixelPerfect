<template>
  <div id="app">
    <h1>Image Resizer</h1>
    <input type="file" @change="onFileChange" accept="image/*"><br>
    <div v-if="currentDimensionsVisible">
      <p>Current Dimensions: <span>{{ currentWidth }}</span> x <span>{{ currentHeight }}</span></p>
    </div>
    <div v-if="showResizeFields">
      <label for="width">Width:</label>
      <input type="number" v-model="width" class="input-width" placeholder="Enter width"><br>
      <label for="height">Height:</label>
      <input type="number" v-model="height" class="input-height" placeholder="Enter height"><br>
      <button @click="submitResize">Submit</button><br>
      <button @click="goBack">Go Back</button>
    </div>
    <div v-else>
      <button @click="showResizeFields = true">Resize Image</button><br>
      <button @click="submitReduceTo1MB">Reduce Image Size to 1MB</button><br>
    </div>
    <canvas ref="canvas" style="display:none;"></canvas>
    <a :href="downloadLink" v-if="downloadLink" :download="downloadFileName">{{ downloadLinkText }}</a>
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
      width: null,
      height: null,
      downloadLink: '',
      downloadLinkText: '',
      downloadFileName: '',
      errorMessage: '',
      showResizeFields: false,
      currentImageSrc: ''
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
    submitResize() {
      const img = new Image();
      img.src = this.currentImageSrc;
      img.onload = () => {
        const width = this.width ? parseInt(this.width) : img.width;
        const height = this.height ? parseInt(this.height) : (img.height / img.width) * width;

        if (!validateDimensions(width, height, (message) => this.displayError(message))) return;

        try {
          const canvas = this.$refs.canvas;
          const resizedImageURL = resizeImage(img, width, height, canvas);
          this.downloadLink = resizedImageURL;
          this.downloadFileName = 'resized-image.jpg';
          this.downloadLinkText = 'Download Resized Image';
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
          this.downloadLink = reducedImageURL;
          this.downloadFileName = 'reduced-size-image.jpg';
          this.downloadLinkText = 'Download Reduced Size Image';
        } catch (error) {
          this.displayError(error.message);
        }
      };
    },
    goBack() {
      this.showResizeFields = false;
      this.width = null;
      this.height = null;
      this.errorMessage = '';
    },
    displayError(message) {
      this.errorMessage = message;
    }
  }
};

// Utility functions defined within the same file

function resizeImage(img, width, height, canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
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
  margin-left: 10px;
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

a {
  margin-top: 10px;
  display: inline-block;
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

a:hover {
  background-color: #218838;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
