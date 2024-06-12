// helpers/PdfHelper.js
import { PDFDocument } from 'pdf-lib';

export async function reducePdfToSize(pdfSrc, targetSize) {
  const arrayBuffer = await fetch(pdfSrc).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  // Placeholder compression: removing metadata and reducing image quality
  const compressedPdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  });

  // Check the size of the compressed PDF
  let currentSize = compressedPdfBytes.length;
  if (currentSize <= targetSize) {
    return URL.createObjectURL(new Blob([compressedPdfBytes], { type: 'application/pdf' }));
  }

  // Reduce quality further if needed
  // This is an example, actual implementation might need multiple iterations
  let quality = 1.0;
  while (currentSize > targetSize && quality > 0) {
    quality -= 0.1;
    const newPdfDoc = await PDFDocument.load(compressedPdfBytes);
    const newCompressedPdfBytes = await newPdfDoc.save({
      useObjectStreams: false,
    });
    currentSize = newCompressedPdfBytes.length;
  }

  return URL.createObjectURL(new Blob([compressedPdfBytes], { type: 'application/pdf' }));
}
