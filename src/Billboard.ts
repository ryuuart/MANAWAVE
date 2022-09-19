import Wiring from "./Wiring";

export default class BillboardTicker extends HTMLElement {
  wires: Wiring;
  content: HTMLElement;

  constructor() {
    super();

    this.classList.add("billboard-ticker");
    const styles = document.createElement("style");
    document.head.appendChild(styles);
    styles.sheet?.insertRule(`
        .billboard-ticker {
            display: block;
            white-space: nowrap;
            position: relative;
            overflow: hidden;
        }
    `);
    styles.sheet?.insertRule(`
        .billboard-ticker > div {
            display: inline-block;
        }
    `);

    this.content = document.createElement("div");
    Array.from(this.children).forEach((element) => {
      this.content.appendChild(element);
    });

    this.wires = new Wiring(this, this.content);
  }

  connectedCallback() {
    // TODO: Add stuff
  }
}
