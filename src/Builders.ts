import { getContentRepetitions } from "./Math";

export interface Builder {
  build: () => any;
}

interface BillboardContentBundle {
  content: HTMLElement;
  wrapper: HTMLElement;
}

export class BillboardBuilder implements Builder {
  product: HTMLElement;
  contentBundle: BillboardContentBundle;

  constructor(product: HTMLElement) {
    this.product = product;
  }

  appendStyleSheet() {
    this.product.classList.add("billboard-ticker");
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
        .billboard-ticker > .container-wrapper > .row > div {
            display: inline-block;
            white-space: initial;
        }
    `);
    styles.sheet?.insertRule(`
        .billboard-ticker > .container-wrapper {
          overflow: hidden;
        }
    `);
    styles.sheet?.insertRule(`
        .billboard-ticker > .container-wrapper > .row {
            display: flow-root;
            position: relative;

            width: inherit;
        }
    `);
  }

  wrapContent(): BillboardContentBundle {
    const content = document.createElement("div");
    Array.from(this.product.children).forEach((element) => {
      content.appendChild(element);
    });

    // Add container wrapper
    const wrapper = document.createElement("div");
    wrapper.classList.add("container-wrapper");
    this.product.appendChild(wrapper);

    this.contentBundle = {
      wrapper,
      content,
    };

    return this.contentBundle;
  }

  cloneContent(contentBundle: BillboardContentBundle) {
    // Set up first row (top row)
    const firstRow = document.createElement("div");
    firstRow.classList.add("row");
    contentBundle.wrapper.appendChild(firstRow);

    // Initial clone is very special becaues it'll have a11y information attached
    const firstClone = firstRow.appendChild(
      contentBundle.content.cloneNode(true)
    ) as HTMLElement; // Have to use first clone as reference because clientWidth only assigned when this is visible
    this.contentBundle.content = firstClone;

    // Clone across width
    for (
      let i = 0;
      i <
      getContentRepetitions(this.product.clientWidth, firstClone.clientWidth);
      i++
    ) {
      const clone = contentBundle.content.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      // TODO: keep track of clones here
      firstRow.append(clone);
    }

    // Update container dimension / bounds
    contentBundle.wrapper.style.height = `${this.product.clientHeight}px`;
    firstRow.style.left = `${-contentBundle.content.clientWidth}px`;
    firstRow.style.top = `${-contentBundle.content.clientHeight}px`;

    // Clone across height
    const MIN_ROWS = 2;
    for (let i = 0; i < MIN_ROWS; i++) {
      const row = firstRow.cloneNode(true) as HTMLElement;
      row.setAttribute("aria-hidden", "true");
      contentBundle.wrapper.appendChild(row);
    }
  }

  build(): BillboardContentBundle {
    this.appendStyleSheet();
    this.cloneContent(this.wrapContent());

    return this.contentBundle;
  }
}
