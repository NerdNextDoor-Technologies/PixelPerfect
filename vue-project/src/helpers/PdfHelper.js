// src/helpers/PdfHelper.js

import { _GSPS2PDF } from '../ghostscript-utils';
import { LogError } from './Error/LogHelper';

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
    LogError(error, 'PdfHelper.js');
    throw error;
  }
}

export { compressPDF };
