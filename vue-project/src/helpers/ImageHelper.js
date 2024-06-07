
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
  
  