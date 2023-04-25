import Billboard from "../Billboard";

/**
 * HTML ShadowDOM element (with no shadowroot) that contains the repeated elements
 */
export default class Component extends HTMLElement {
    billboard: Billboard;
    constructor() {
        super();

        this.billboard = new Billboard(this);
    }
}
