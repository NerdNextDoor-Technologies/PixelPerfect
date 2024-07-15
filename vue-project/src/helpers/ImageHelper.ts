
//TODO Add Data types to the functions
//FIXME rename imageElement to imageElement
//FIXME rename targetWidth to targetWidthInPixels
//FIXME rename targetHeight to targetHeightInPixels
//FIXME combine targetHeight and targetWidth into one object targetSizeInPixels
//FIXME rename canvasElement to canvasElementElement

import { ImageResolution } from '@/models/image/ImageResolution';


export function resizeImage(imageElement: HTMLImageElement, targetImageResolution: { width: number; height: number }, qualityFactor: number = 1.0): string {
  const canvasElement = document.createElement('canvas');
  canvasElement.width = targetImageResolution.width;
  canvasElement.height = targetImageResolution.height;
  const canvasElementContext = canvasElement.getContext('2d');
  canvasElementContext.drawImage(imageElement, 0, 0, targetImageResolution.width, targetImageResolution.height);
  return canvasElement.toDataURL('image/jpeg', qualityFactor);
}

export function resizedImage1(imageElement: HTMLImageElement, targetSizeInBytes: number): string {
  const minimumImageResolution = { width: 50, height: 50 }; // Minimum allowable dimensions to avoid too much reduction
  let qualityFactor = 1.0;
  const targetImageResolution = new ImageResolution(imageElement.width, imageElement.height);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    //2300x3400
    const reductionRatio = Math.sqrt(targetSizeInBytes / (imageElement.src.length * 3 / 4));
    targetImageResolution.width = Math.round(imageElement.width * reductionRatio);
    targetImageResolution.height = Math.round(imageElement.height * reductionRatio);

    while (targetImageResolution.width > minimumImageResolution.width && targetImageResolution.height > minimumImageResolution.height) {
      const resizedImage = resizeImage(imageElement, targetImageResolution, qualityFactor);
      const resizedImageSizeInBytes = resizedImage.length * 3 / 4;

      if (resizedImageSizeInBytes <= targetSizeInBytes) {
        return resizedImage;
      }

      // Reduce the target dimensions by 10%
      targetImageResolution.width = Math.round(targetImageResolution.width * 0.9);
      targetImageResolution.height = Math.round(targetImageResolution.height * 0.9);
    }

    qualityFactor -= 0.1;
    if (qualityFactor <= 0.5) {
      throw new Error("Unable to convert file, target size too small");
    }
  }
}






//   // let qualityFactor = 1.0;

//   // while (true) {
//   //   let reductionRatio = Math.round(targetSizeInBytes / image.sizeInBytes);
//   //   let targetSizeInPixels = { width: image.width / reductionRatio, height: image.height / reductionRatio };
//   //   while (targetSizeInPixels > minimumTargetSizeInPixels) {
//   //     let resizedImage = resizeImage(image, targetSizeInPixels.width, targetSizeInPixels.height, qualityFactor);
//   //     if (resizedImage.length <= targetSizeInBytes) {
//   //       return resizedImage;
//   //     }
//   //     targetSizeInPixels = reduceTargetSizeBy10Percent(targetSizeInPixels);

//   //   }
//   //   qualityFactor -= 0.1;
//   //   if(qualityFactor<=0.5)
//   //     throw new ConvertException("Unable to convert file, target size too small")
//   // }


//   const canvasElement = document.createElement('canvasElement');
//   const canvasElementContext = canvasElement.getContext('2d');

//   let quality = 0.9;
//   let resultSize = targetSize + 1; // Initial size for the loop condition
//   let dataURL = '';

//   canvasElement.width = image.width;
//   canvasElement.height = image.height;

//   while (resultSize > targetSize) {
//     canvasElementContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
//     canvasElementContext.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);

//     dataURL = canvasElement.toDataURL('image/jpeg', quality);
//     resultSize = dataURL.length * (3 / 4);

//     quality -= 0.1;
//     if (quality < 0.1) break; // Prevent infinite loop
//   }

//   return dataURL;
// }


