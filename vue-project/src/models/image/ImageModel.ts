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

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      // Define the onload event handler for the FileReader
      reader.onload = (e) => {
        const img = new Image();

        // Define the onload event handler for the Image
        img.onload = () => {
          try {
            // Set the image resolution
            this.currentResolution = new ImageResolution(img.width, img.height);
            // Set the image source
            this.currentImageSrc = e.target?.result as string;

            resolve(this);
          } catch (error) {
            LogError(error, this.currentFileName);
            reject(error);
          }
        };

        // Define the onerror event handler for the Image
        img.onerror = () => {
          const error = new Error("Invalid image file.");
          LogError(error, this.currentFileName);
          reject(error);
        };

        // Set the image source to the result of the FileReader
        img.src = e.target?.result as string;
      };

      // Define the onerror event handler for the FileReader
      reader.onerror = () => {
        const error = new Error("Error reading file.");
        LogError(error, this.currentFileName);
        reject(error);
      };

      // Start reading the file
      reader.readAsDataURL(file);
    });
  }
}