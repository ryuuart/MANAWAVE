export interface State {
  data: {};
}

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

  updateContentDimensions(content: HTMLElement) {
    this.data.dimensions["contentWidth"] = content.clientWidth;
    this.data.dimensions["contentHeight"] = content.clientHeight;
  }
}
