// src/helpers/PdfHelper.js

import { _GSPS2PDF } from '../ghostscript-utils';

function handleDetailedError(error, fileName) {
  console.error(`Error in ${fileName}:`, error.message);
  console.error(`Stack trace:`, error.stack);
  alert(`An error occurred in ${fileName}: ${error.message}`);
}

function compressPDF(pdf, filename, compressionLevel, onLoadComplete, onProgress, onStatusUpdate) {
  const dataObject = { psDataURL: pdf };
  try {
    _GSPS2PDF(dataObject,
      (element) => {
        onLoadComplete(element);
      },
      (...args) => onProgress(args),
      (element) => onStatusUpdate(element),
      compressionLevel
    );
  } catch (error) {
    handleDetailedError(error, 'PdfHelper.js');
    throw error;
  }
}

export { compressPDF, handleDetailedError };
