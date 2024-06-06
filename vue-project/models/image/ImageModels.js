// models/image/ImageModels.js

export class ImageProperties {
    /**
     * @type {number}
     */
    currentWidth;
  
    /**
     * @type {number}
     */
    currentHeight;
  
    /**
     * @type {number}
     */
    targetWidth;
  
    /**
     * @type {number}
     */
    targetHeight;
  
    /**
     * @type {string}
     */
    currentImageSrc;
  
    constructor(file = null) {
      this.currentWidth = 0;
      this.currentHeight = 0;
      this.targetWidth = 0;
      this.targetHeight = 0;
      this.currentImageSrc = '';
  
      if (file) {
        this.loadImage(file);
      }
    }
  
    loadImage(file) {
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
    }
  
    displayError(message) {
      console.error(message);
    }
  }
  
  export class Errors {
    /**
     * @type {string}
     */
    width;
  
    /**
     * @type {string}
     */
    height;
  
    constructor() {
      this.width = '';
      this.height = '';
    }
  }
  
  export class AppState {
    /**
     * @type {boolean}
     */
    isDownloading;
  
    /**
     * @type {boolean}
     */
    showResizeFields;
  
    /**
     * @type {boolean}
     */
    currentDimensionsVisible;
  
    /**
     * @type {string}
     */
    errorMessage;
  
    constructor() {
      this.isDownloading = false;
      this.showResizeFields = false;
      this.currentDimensionsVisible = false;
      this.errorMessage = '';
    }
  }
  