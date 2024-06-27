//FIXME Rename states to something relevant
const States = {
  INIT: 'INIT',
  SELECTED: 'SELECTED',
  LOADING: 'LOADING',
  TO_BE_DOWNLOADED: 'TO_BE_DOWNLOADED'
};

class PdfData {
  constructor() {

    //fixme variable name
    /** @type {string} */
    this.state = States.INIT;

    /** @type {{ filename: string, url: string } | null} */
    this.file = null;

    /** @type {URL} */
    this.downloadLink = '';

    //FIXME capitalize
    /** @type {'low' | 'medium' | 'high'} */
    this.compressionLevel = 'low';
  }
}

export { PdfData, States };