const States = {
  INIT: 'init',
  SELECTED: 'selected',
  LOADING: 'loading',
  TO_BE_DOWNLOADED: 'toBeDownloaded'
};

class DefaultValues {
  constructor() {
    /** @type {string} */
    this.state = States.INIT;

    /** @type {{ filename: string, url: string } | null} */
    this.file = null;

    /** @type {string} */
    this.downloadLink = '';

    /** @type {'low' | 'medium' | 'high'} */
    this.compressionLevel = 'low';
  }
}

export { DefaultValues, States };