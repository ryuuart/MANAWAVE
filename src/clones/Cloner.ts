import Clone from "./Clone";
import Template from "./Template";

// Continuously clone templates and returns it for use
export default class Cloner {
    templates: Template[];
    _currTemplateIndex: number = -1;

    constructor() {
        this.templates = [];
    }

    // register a template
    register(template: Template) {
        this.templates.push(template);
    }

    // clone N clones
    clone(n: number): Clone[] {
        const clones: Clone[] = [];
        for (let i = 0; i < n; i++) {
            const clone = new Clone(this.getNextTemplate());
            clones.push(clone);
        }

        return clones;
    }

    // return next template that will be used to clone
    getNextTemplate(): Template {
        if (this._currTemplateIndex + 1 >= this.templates.length)
            this._currTemplateIndex = 0;
        else this._currTemplateIndex++;

        return this.templates[this._currTemplateIndex];
    }
}
