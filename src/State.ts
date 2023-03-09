export interface State {
  data: {};
}

/**
 * A data model that represents the current state of a Billboard
 */
export default class BillboardState implements State {
  data: {
    direction: number;
    paused: boolean;
    speed: number;
    dimensions: {
      containerWidth: number;
      containerHeight: number;
      contentWidth: number;
      contentHeight: number;
    };
  };
  clones: [HTMLElement];

  constructor() {
    this.data = {
      direction: 0,
      paused: false,
      speed: 1,
      dimensions: {
        containerWidth: 0,
        containerHeight: 0,
        contentWidth: 0,
        contentHeight: 0,
      },
    };
  }

  /**
   * Called when the Billboard size needs to be recalculated.
   *
   * @param content the HTMLElement that contains the repititions
   */
  updateContentDimensions(content: HTMLElement) {
    this.data.dimensions["contentWidth"] = content.clientWidth;
    this.data.dimensions["contentHeight"] = content.clientHeight;
  }
}
