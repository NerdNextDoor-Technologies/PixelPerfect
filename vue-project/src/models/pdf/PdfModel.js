export class PdfData {
  /**
   * @type {string}
   */
  currentPdfSrc;

  /**
   * @type {number}
   */
  currentFileSize;

  constructor(file = null) {
    this.currentPdfSrc = '';
    this.currentFileSize = 0;

    if (file) {
      this.loadPdf(file);
    }
  }

  loadPdf(file, displayError, updateState) {
    this.currentFileSize = file.size;
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      const pdfHeader = String.fromCharCode.apply(null, uint8Array.subarray(0, 4));
      if (pdfHeader !== '%PDF') {
        displayError("File is not a valid PDF.");
        return;
      }
      this.currentPdfSrc = URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/pdf' }));
      updateState(true, false); // update state to show current size and enable buttons
    };
    reader.onerror = () => {
      displayError("Error reading file.");
    };
    reader.readAsArrayBuffer(file);
  }
}

export class Errors {
  constructor() {
    this.general = '';
  }
}

export class AppState {
  /**
   * @type {boolean}
   */
  isDownloading;

  /**
   * @type {boolean}
   */
  showResizeFields;

  /**
   * @type {boolean}
   */
  currentFileDetailsVisible;

  /**
   * @type {string}
   */
  errorMessage;

  /**
   * @type {boolean}
   */
  buttonsDisabled;

  constructor() {
    this.isDownloading = false;
    this.showResizeFields = false;
    this.currentFileDetailsVisible = false;
    this.errorMessage = '';
    this.buttonsDisabled = false;
  }
}
