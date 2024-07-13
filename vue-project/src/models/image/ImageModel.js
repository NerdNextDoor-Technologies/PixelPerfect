// models/image/ImageModel.js
import { LogError } from '@/helpers/LogHelper/LogError';
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

  loadImage(file) {
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
          LogError(error, this.currentFileName);
          return;
        }
      };
      img.onerror = () => {
        LogError(new Error("Invalid image file."), this.currentFileName);
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      LogError(new Error("Error reading file."), this.currentFileName);
    };
    reader.readAsDataURL(file);
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

