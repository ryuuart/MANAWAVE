import { Builder, BillboardBuilder } from "./Builders";

export default class BillboardDirector {
  product: HTMLElement;
  builder: BillboardBuilder;

  constructor(materials: HTMLElement) {
    this.product = materials;

    // Register builders
    this.builder = new BillboardBuilder(this.product);
  }

  build() {
    return this.builder.build();
  }
}
