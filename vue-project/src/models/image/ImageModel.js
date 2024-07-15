// models/image/ImageModel.js
import { LogError } from '@/helpers/LogHelper/LogError';
import { ImageResolution } from './ImageResolution';
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

  constructor(file) {
    //FIXME Replace current width and height with resolution. Remove targetWidth and targetHeight
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

  //TODO use the constructor instead of this function
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
