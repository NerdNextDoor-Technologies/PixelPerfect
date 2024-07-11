
//TODO Add Data types to the functions
//FIXME rename img to imageElement
//FIXME rename targetWidth to targetWidthInPixels
//FIXME rename targetHeight to targetHeightInPixels
//FIXME combine targetHeight and targetWidth into one object targetSizeInPixels
//FIXME rename canvas to canvasElement
//FIXME rename ctx to canvasContext
export function resizeImage(img, targetWidth, targetHeight) {
  //TODO Check if canvas can be declared once and reused
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  console.log()
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL('image/jpeg');
}

//FIXME Rename targetSize to targetSizeInBytes
//FIXME Rename image to imageElement
//FIXME Rename dataURL to resizedImage
//FIXME Rename quality to qualityFactor
//FIXME Rename resultSize to resizedImageSize
export function resizeImage(image:Image , targetSizeInPixels:ImageResolution) {
  // TODO Implement a better algorithm to reduce the image size -
  // Calculate the reduction ratio of current image size to target size
  // Call resizeImage with the reduction ratio as targetSizeInPixels
  // If the resized image size is still greater than targetSizeInBytes, repeat the process
  // If the resized image size is less than targetSizeInBytes, return the resized image
  // If the resized image is still greater than a minimum target size, start the entire process with a reduced quality factor



  // let qualityFactor = 1.0;

  // while (true) {
  //   let reductionRatio = Math.round(targetSizeInBytes / image.sizeInBytes);
  //   let targetSizeInPixels = { width: image.width / reductionRatio, height: image.height / reductionRatio };
  //   while (targetSizeInPixels > minimumTargetSizeInPixels) {
  //     let resizedImage = resizeImage(image, targetSizeInPixels.width, targetSizeInPixels.height, qualityFactor);
  //     if (resizedImage.length <= targetSizeInBytes) {
  //       return resizedImage;
  //     }
  //     targetSizeInPixels = reduceTargetSizeBy10Percent(targetSizeInPixels);

  //   }
  //   qualityFactor -= 0.1;
  //   if(qualityFactor<=0.5)
  //     throw new ConvertException("Unable to convert file, target size too small")
  // }


  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let quality = 0.9;
  let resultSize = targetSize + 1; // Initial size for the loop condition
  let dataURL = '';

  canvas.width = image.width;
  canvas.height = image.height;

  while (resultSize > targetSize) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    dataURL = canvas.toDataURL('image/jpeg', quality);
    resultSize = dataURL.length * (3 / 4);

    quality -= 0.1;
    if (quality < 0.1) break; // Prevent infinite loop
  }

  return dataURL;
}


