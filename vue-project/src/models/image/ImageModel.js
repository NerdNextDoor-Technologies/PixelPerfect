// models/image/ImageModel.js

export class ImageData {
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

  /**
   * @type {number}
   */
  currentFileSize;

  /**
   * @type {string}
   */
  currentFileName;

  constructor(file = null) {
    this.currentWidth = 0;
    this.currentHeight = 0;
    this.targetWidth = 0;
    this.targetHeight = 0;
    this.currentImageSrc = '';
    this.currentFileSize = 0;
    this.currentFileName = '';

    if (file) {
      this.loadImage(file);
    }
  }

  loadImage(file, displayError) {
    this.currentFileSize = file.size;
    this.currentFileName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.currentWidth = img.width;
        this.currentHeight = img.height;
        this.currentImageSrc = e.target.result;
        try {
          new ImageResolution(this.currentWidth, this.currentHeight); // Validate the image resolution
        } catch (error) {
          displayError(error.message);
          return;
        }
      };
      img.onerror = () => {
        displayError("Invalid image file.");
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      displayError("Error reading file.");
    };
    reader.readAsDataURL(file);
  }

  validateResolution(targetWidth, targetHeight, displayError) {
    this.isValid = true;
    this.errorMessage = '';

    if (!Number.isInteger(targetWidth) || !Number.isInteger(targetHeight)) {
      this.isValid = false;
      this.errorMessage = "Width and height must be integers.";
      displayError(this.errorMessage);
    } else if (targetWidth <= 0 || targetHeight <= 0) {
      this.isValid = false;
      this.errorMessage = "Width and height must be positive values.";
      displayError(this.errorMessage);
    } else if (targetWidth > this.currentWidth || targetHeight > this.currentHeight) {
      this.isValid = false;
      this.errorMessage = "Target dimensions must be less than or equal to current dimensions.";
      displayError(this.errorMessage);
    }

    if (this.isValid) {
      this.targetWidth = targetWidth;
      this.targetHeight = targetHeight;
    }
  }

  displayError(message) {
    console.error(message);
  }
}

export class ImageResolution {
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.validate();
  }

  validate() {
    if (!Number.isInteger(this.width) || !Number.isInteger(this.height)) {
      throw new Error("Width and height must be integers.");
    }
    if (this.width <= 0 || this.height <= 0) {
      throw new Error("Width and height must be positive values.");
    }
    if (this.width * this.height > 25600000) {
      throw new Error("The product of width and height must not exceed 25,600,000.");
    }
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

// models/app/AppState.js

export class AppState {
  /**
   * @type {boolean}
   */
  isDownloading;

  /**
   * @type {boolean}
   */
  buttonsDisabled;

  /**
   * @type {boolean}
   */
  showResizeFields;

  /**
   * @type {boolean}
   */
  keepAspectRatio;

  /**
   * @type {string}
   */
  errorMessage;

  constructor() {
    this.isDownloading = false;
    this.buttonsDisabled = false;
    this.showResizeFields = false;
    this.keepAspectRatio = true;
    this.errorMessage = '';
  }
}
