// models/image/ImageModels.js

export class imageData {
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

  export class ImageResolution {
    constructor(targetWidth, targetHeight, currentWidth, currentHeight, displayError) {
      if (!Number.isInteger(targetWidth) || !Number.isInteger(targetHeight)) {
        displayError("Width and height must be integers.");
        return null;
      }
      if (targetWidth <= 0 || targetHeight <= 0) {
        displayError("Width and height must be positive values.");
        return false;
      }
      if (targetWidth > currentWidth || targetHeight > currentHeight) {
        displayError("Target dimensions must be less than or equal to current dimensions.");
        return false;
      }
  
      this.targetWidth = targetWidth;
      this.targetHeight = targetHeight;
      return true;
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
  