type onStartChangeParams = { newStartX?: number; newStartY?: number };
type eventMessagesParams = onStartChangeParams;

class Dimensions {
  TICKER_ELEMENT_WIDTH: number;
  TICKER_ELEMENT_HEIGHT: number;
  TICKER_WIDTH: number;
  TICKER_HEIGHT: number;
  X_START: number;
  Y_START: number;
  MAGNITUDE: [number, number];

  constructor() {
    this.TICKER_ELEMENT_WIDTH = 0;
    this.TICKER_ELEMENT_HEIGHT = 0;
    this.TICKER_WIDTH = 0;
    this.TICKER_HEIGHT = 0;
    this.MAGNITUDE = [420, 0];
    this.X_START = 0;
    this.Y_START = 0;
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
    this.X_START = this.MAGNITUDE[0] - this.TICKER_ELEMENT_WIDTH;
    this.Y_START = 0;
  }

  onStartChange({ newStartX, newStartY }: onStartChangeParams) {
    this.X_START = newStartX ?? this.X_START;
    this.Y_START = newStartY ?? this.Y_START;
  }

  listen(event: string, message: eventMessagesParams) {
    switch (event) {
      case "startChange":
        this.onStartChange(message);
        break;
    }
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
