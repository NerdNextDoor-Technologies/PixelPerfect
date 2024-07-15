// models/image/ImageModel.js
import { LogError } from '@/helpers/LogHelper/LogError';
import { ImageResolution } from './ImageResolution';
export class ImageData {

  currentImageSrc: string;
  currentFileSize: number;
  currentFileName: string;
  currentResolution: ImageResolution;

  constructor(file: File) {


    this.currentFileSize = file.size;
    this.currentFileName = file.name;

    this.loadImage(file);

  }

  //TODO use the constructor instead of this function
  loadImage(file: File) {

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {

        try {
          this.currentResolution = new ImageResolution(img.width, img.height); // Validate and set the image resolution
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
