import { Builder, BillboardBuilder } from "./Builders";

/**
 * Logic layer of the Billboard that controls the setup and configuration of the
 * overall BillboardTicker
 */
export default class BillboardDirector {
  product: HTMLElement;
  builder: BillboardBuilder;

  /**
   * Configures the `HTMLElement` the Billboard should operate on
   *
   * @param materials The HTMLElement that is the root container of all repeated content in Billboard HTMLElement
   */
  constructor(materials: HTMLElement) {
    this.product = materials;

    // Register builders
    this.builder = new BillboardBuilder(this.product);
  }

  /**
   * Using the currently specified builder, build the object and return the output
   * @returns the root wrapper and its children wrapped in a `content` `div`
   */
  build() {
    return this.builder.build();
  }
}
