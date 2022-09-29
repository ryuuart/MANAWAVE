import BillboardDirector from "./BillboardDirector";
import Animation from "./animation";
import BillboardState from "./State";

export default class BillboardTicker extends HTMLElement {
  state: BillboardState;

  constructor() {
    super();

    const Director = new BillboardDirector(this);
    const BillboardContent = Director.build();

    this.state = new BillboardState();
    this.state.updateContentDimensions(BillboardContent.content);

    if (this.hasAttribute("speed"))
      this.state.data.speed = parseFloat(this.getAttribute("speed")!);
    if (this.hasAttribute("direction"))
      switch (this.getAttribute("direction")!) {
        case "up":
          this.state.data.direction = 90;
          break;
        case "down":
          this.state.data.direction = 270;
          break;
        case "left":
          this.state.data.direction = 180;
          break;
        case "right":
          this.state.data.direction = 0;
          break;
        default:
          this.state.data.direction = Math.min(
            parseFloat(this.getAttribute("direction")!),
            360
          );
      }

    const AnimationController = new Animation(this.state);
    AnimationController.animate(this);
  }
}
