
export function resizeImage(img, targetWidth, targetHeight) {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL('image/jpeg');
}

// helpers/ImageHelper.js

export function reduceImageToSize(image, targetSize) {
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
  resultSize = dataURL.length * (3/4);

  quality -= 0.1;
  if (quality < 0.1) break; // Prevent infinite loop
}

return dataURL;
}


