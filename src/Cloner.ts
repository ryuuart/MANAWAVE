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

    // Add container wrapper
    const containerWrapper = document.createElement("div");
    containerWrapper.classList.add("container-wrapper");
    this.container.appendChild(containerWrapper);

    // Set up center row
    const centerRow = document.createElement("div");
    centerRow.classList.add("row");
    containerWrapper.appendChild(centerRow);

    // Initial clone is very special becaues it'll have a11y information attached
    this.clones.push(
      // this.container.appendChild(this.mold.cloneNode(true)) as HTMLElement
      centerRow.appendChild(this.mold.cloneNode(true)) as HTMLElement
    );

    // Update dimensions once rendered
    this.wirebox.updateDimensions(this.container, this.clones[0]);
    const { width: contentWidth, height: contentHeight } =
      this.wirebox.dimensions.content;
    containerWrapper.style.height = `${contentHeight}px`;

    for (let i = 0; i < this.getRepetitions(); i++) {
      const clone = this.mold.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      this.clones.push(clone);
      // this.container.append(clone);
      centerRow.append(clone);
    }

    centerRow.style.left = `${-contentWidth}px`;
    centerRow.style.top = `${-contentHeight}px`;

    const upperRow = centerRow.cloneNode(true) as HTMLElement;
    upperRow.style.top = `${-contentHeight}px`;
    upperRow.setAttribute("aria-hidden", "true");

    const lowerRow = centerRow.cloneNode(true) as HTMLElement;
    lowerRow.style.top = `${-contentHeight}px`;
    lowerRow.setAttribute("aria-hidden", "true");

    containerWrapper.appendChild(upperRow);
    containerWrapper.appendChild(lowerRow);
  }

  getRepetitions() {
    const { width: containerWidth, height: containerHeight } =
      this.wirebox.dimensions.container;
    const { width: contentWidth, height: contentHeight } =
      this.wirebox.dimensions.content;

    const repetitions = Math.ceil(containerWidth / contentWidth) + 1;

    return repetitions;
  }
}
