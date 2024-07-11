import { COMPRESSIONLEVEL } from "@/assets/constants/compression_level";


const CompressionState = {
  NO_FILE_SELECTED: 'NO_FILE_SELECTED',
  FILE_SELECTED: 'FILE_SELECTED',
  COMPRESSION_IN_PROGRESS: 'COMPRESSION_IN_PROGRESS',
  READY_FOR_DOWNLOAD: 'READY_FOR_DOWNLOAD'
};

class PdfData {
  constructor() {

    /** @type {string} */
    this.filestate = CompressionState.NO_FILE_SELECTED;

    /** @type {{ filename: string, url: string } | null} */
    this.selectedFileMetadata = null;

    /** @type {URL} */
    this.downloadLink = '';

    /** @type { COMPRESSIONLEVEL.LOW | COMPRESSIONLEVEL.MEDIUM | COMPRESSIONLEVEL.HIGH} */
    this.compressionLevel = COMPRESSIONLEVEL.LOW;
  }
}

export { PdfData, CompressionState };