// helpers/UtilityFunctions.js

export function resizeImage(img, targetWidth, targetHeight) {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    return canvas.toDataURL('image/jpeg');
  }
  
  export function reduceImageTo1MB(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let quality = 1.0;
    let resizedImageURL = canvas.toDataURL('image/jpeg', quality);
    while (resizedImageURL.length > 1 * 1024 * 1024 && quality > 0.1) {
      quality -= 0.1;
      resizedImageURL = canvas.toDataURL('image/jpeg', quality);
    }
    return resizedImageURL;
  }
  
  export function validateDimensions(width, height, displayError) {
    const product = width * height;
    if (width <= 0) {
      displayError("The width cannot be negative or zero. Please enter a width greater than 0.");
      return false;
    }
    if (height <= 0) {
      displayError("The height cannot be negative or zero. Please enter a height greater than 0.");
      return false;
    }
    if (product > 25600000) {
      displayError("The product of width and height must not exceed 25,600,000. Please enter valid dimensions.");
      return false;
    }
    return true;
  }
  