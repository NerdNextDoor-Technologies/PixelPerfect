
//TODO Add Data types to the functions
//FIXME rename img to imageElement
//FIXME rename targetWidth to targetWidthInPixels
//FIXME rename targetHeight to targetHeightInPixels
//FIXME combine targetHeight and targetWidth into one object targetSizeInPixels
//FIXME rename canvas to canvasElement
//FIXME rename ctx to canvasContext
export function resizeImage(img, imageResolution) {
  const canvas = document.createElement('canvas');
  canvas.width = imageResolution.width;
  canvas.height = imageResolution.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, imageResolution.width, imageResolution.height);
  return canvas.toDataURL('image/jpeg');
}

export function resizeImage1(img, width, height, quality = 1.0) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
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
//FIXME Rename targetSize to targetSizeInBytes
//FIXME Rename image to imageElement
//FIXME Rename dataURL to resizedImage
//FIXME Rename quality to qualityFactor
//FIXME Rename resultSize to resizedImageSize
// export function resizeImage(image: Image, targetSizeInPixels: ImageResolution) {
//   // TODO Implement a better algorithm to reduce the image size -
//   // Calculate the reduction ratio of current image size to target size
//   // Call resizeImage with the reduction ratio as targetSizeInPixels
//   // If the resized image size is still greater than targetSizeInBytes, repeat the process
//   // If the resized image size is less than targetSizeInBytes, return the resized image
//   // If the resized image is still greater than a minimum target size, start the entire process with a reduced quality factor



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


//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');

//   let quality = 0.9;
//   let resultSize = targetSize + 1; // Initial size for the loop condition
//   let dataURL = '';

//   canvas.width = image.width;
//   canvas.height = image.height;

//   while (resultSize > targetSize) {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

//     dataURL = canvas.toDataURL('image/jpeg', quality);
//     resultSize = dataURL.length * (3 / 4);

//     quality -= 0.1;
//     if (quality < 0.1) break; // Prevent infinite loop
//   }

//   return dataURL;
// }


