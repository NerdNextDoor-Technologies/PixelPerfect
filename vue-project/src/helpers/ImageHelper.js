
//TODO Add Data types to the functions
//FIXME rename imageElement to imageElement
//FIXME rename targetWidth to targetWidthInPixels
//FIXME rename targetHeight to targetHeightInPixels
//FIXME combine targetHeight and targetWidth into one object targetSizeInPixels
//FIXME rename canvasElement to canvasElementElement
//FIXME rename canvasElementContext to canvasElementContext
export function resizeImage(imageElement, targetimageResolution) {
  const canvasElement = document.createElement('canvas');
  canvasElement.width = targetimageResolution.width;
  canvasElement.height = targetimageResolution.height;
  const canvasElementContext = canvasElement.getContext('2d');
  canvasElementContext.drawImage(imageElement, 0, 0, targetimageResolution.width, targetimageResolution.height);
  return canvasElement.toDataURL('image/jpeg');
}

export function resizeImage1(imageElement, width, height, quality = 1.0) {
  const canvasElement = document.createElement('canvas');
  canvasElement.width = width;
  canvasElement.height = height;
  const canvasElementContext = canvasElement.getContext('2d');
  canvasElementContext.drawImage(imageElement, 0, 0, width, height);
  return canvasElement.toDataURL('image/jpeg', quality);
}



export function reduceImageToSize(image, targetSizeInBytes) {
  const minimumTargetSizeInPixels = { width: 50, height: 50 }; // Minimum allowable dimensions to avoid too much reduction
  let qualityFactor = 1.0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const reductionRatio = Math.sqrt(targetSizeInBytes / (image.src.length * 3 / 4));
    let targetWidth = Math.round(image.width * reductionRatio);
    let targetHeight = Math.round(image.height * reductionRatio);

    while (targetWidth > minimumTargetSizeInPixels.width && targetHeight > minimumTargetSizeInPixels.height) {
      const resizedImage = resizeImage1(image, targetWidth, targetHeight, qualityFactor);
      const resizedImageSizeInBytes = resizedImage.length * 3 / 4;

      if (resizedImageSizeInBytes <= targetSizeInBytes) {
        return resizedImage;
      }

      // Reduce the target dimensions by 10%
      targetWidth = Math.round(targetWidth * 0.9);
      targetHeight = Math.round(targetHeight * 0.9);
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


