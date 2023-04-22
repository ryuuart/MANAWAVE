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
    // if you need to apply some custom operations on the clone while cloning
    clone(n: number, fn?: (clone: Clone) => void): Clone[] {
        const clones: Clone[] = [];
        for (let i = 0; i < n; i++) {
            const clone = new Clone(this.getNextTemplate());
            clones.push(clone);

            if (fn) fn(clone);
        }

        return clones;
    }

    // clone a template sequence
    // continue option means to return template index to continue
    // cloning from where it last left off
    cloneSequence(options: {
        continue?: boolean;
        fn?: (clone: Clone) => void;
    }): Clone[] {
        let prevTemplateIndex = this._currTemplateIndex;

        this._currTemplateIndex = 0;

        const clones = this.clone(
            this.templates.length,
            options.fn ?? undefined
        );

        if (options?.continue) this._currTemplateIndex = prevTemplateIndex;

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