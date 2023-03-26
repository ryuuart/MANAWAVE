class Dimensions {
  TICKER_ELEMENT_WIDTH: number;
  TICKER_ELEMENT_HEIGHT: number;
  TICKER_WIDTH: number;
  TICKER_HEIGHT: number;
  DIRECTION: [number, number];

  constructor() {
    this.TICKER_ELEMENT_WIDTH = 0;
    this.TICKER_ELEMENT_HEIGHT = 0;
    this.TICKER_WIDTH = 0;
    this.TICKER_HEIGHT = 0;
    this.DIRECTION = [0, 0];
  }

  init(ticker: HTMLElement, tickerElement: HTMLElement) {
    if (document.body.contains(tickerElement)) {
      ticker.style.height = `${tickerElement.offsetHeight}px`;
      this.update(ticker, tickerElement);
    } else {
      console.error("Ticker elements not added yet, but they should be");
    }
  }

  update(ticker: HTMLElement, tickerElement: HTMLElement) {
    this.TICKER_ELEMENT_WIDTH = tickerElement.offsetWidth;
    this.TICKER_ELEMENT_HEIGHT = tickerElement.offsetHeight;
    this.TICKER_WIDTH = ticker.clientWidth;
    this.TICKER_HEIGHT = ticker.clientHeight;
  }

  toString() {
    return `
Ticker Dimensions:
    Width: ${this.TICKER_WIDTH} 
    Height: ${this.TICKER_HEIGHT} 
Ticker Element Dimensions:
    Width: ${this.TICKER_ELEMENT_WIDTH} 
    Height: ${this.TICKER_ELEMENT_HEIGHT}
    `;
  }
}

export default new Dimensions();
