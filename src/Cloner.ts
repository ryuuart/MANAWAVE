import Wiring from "./Wiring";

export default class Cloner {
  clones: HTMLElement[] = [];
  container: HTMLElement;
  mold: HTMLElement;
  wirebox: Wiring;

  constructor(wireBox: Wiring) {
    this.container = wireBox.container;
    this.mold = wireBox.content;
    this.wirebox = wireBox;

    // Initial clone is very special becaues it'll have a11y information attached
    this.clones.push(
      this.container.appendChild(this.mold.cloneNode(true)) as HTMLElement
    );

    wireBox.updateDimensions(this.container, this.clones[0]);

    const { width: contentWidth, height: contentHeight } =
      this.wirebox.dimensions.content;
    this.clones[0].style.transform = `translateX(-${contentWidth}px)`;

    for (let i = 0; i < this.getRepetitions(); i++) {
      const clone = this.mold.cloneNode(true) as HTMLElement;
      clone.style.transform = `translateX(-${contentWidth}px)`;
      clone.setAttribute("aria-hidden", "true");
      this.clones.push(clone);
      this.container.append(clone);
    }
  }

  getRepetitions() {
    const { width: containerWidth, height: containerHeight } =
      this.wirebox.dimensions.container;
    const { width: contentWidth, height: contentHeight } =
      this.wirebox.dimensions.content;

    const repetitions = Math.ceil(containerWidth / contentWidth);

    return repetitions;
  }
}
