import { COMPRESSIONLEVEL } from "../enum/COMPRESSIONLEVEL";
import { COMPRESSIONSTATE } from "../enum/CompressionState";

class PdfData {
  constructor() {

    /** @type {string} */
    this.filestate = COMPRESSIONSTATE.NO_FILE_SELECTED;

    /** @type {{ filename: string, url: string } | null} */
    this.selectedFileMetadata = null;

    /** @type {URL} */
    this.downloadLink = '';

    /** @type { COMPRESSIONLEVEL.LOW | COMPRESSIONLEVEL.MEDIUM | COMPRESSIONLEVEL.HIGH} */
    this.compressionLevel = COMPRESSIONLEVEL.LOW;
  }
}

export { PdfData };