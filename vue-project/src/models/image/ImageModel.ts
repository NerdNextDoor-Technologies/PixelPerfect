// models/image/ImageModel.js
import { LogError } from '@/helpers/LogHelper/LogError';
import { ImageResolution } from './ImageResolution';
export class ImageData {

  targetWidth: number
  targetHeight: number
  currentImageSrc: string;
  currentFileSize: number;
  currentFileName: string;
  resolution: ImageResolution;
  constructor(file) {
    //FIXME Replace current width and height with resolution. Remove targetWidth and targetHeight
    this.resolution = new ImageResolution(1, 1);
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

        try {
          this.resolution = new ImageResolution(img.width, img.height); // Validate and set the image resolution
          this.currentImageSrc = e.target?.result as string;
        } catch (error) {
          LogError(error, this.currentFileName);
          return;
        }
      };
      img.onerror = () => {
        LogError(new Error("Invalid image file."), this.currentFileName);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      LogError(new Error("Error reading file."), this.currentFileName);
    };
    reader.readAsDataURL(file);
  }
}
