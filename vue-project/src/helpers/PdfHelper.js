// src/helper/pdfhelper.js
import { _GSPS2PDF } from '../ghostscript-utils';

function compressPDF(pdf, filename, compressionLevel, onLoadComplete, onProgress, onStatusUpdate) {
  const dataObject = { psDataURL: pdf };
  _GSPS2PDF(dataObject,
    (element) => {
      onLoadComplete(element);
    },
    (...args) => onProgress(args),
    (element) => onStatusUpdate(element),
    compressionLevel
  );
}

export { compressPDF };
