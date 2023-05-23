import { Ticker, TickerItem } from "../ticker";
import { Template } from "../clones";
import { TickerStore } from "../data";
import Lifecycle from "@billboard/lib/Lifecycle";

export default class TickerItemFactory {
    private _templates: Template[];
    private _templateIndex: number = -1;
    private _ticker: Ticker; // keep track of the ticker it should be adding clones to for loading purposes
    private _store: TickerStore;
    private _lifecycle: Lifecycle;

    constructor(
        registry: TickerStore,
        ticker: Ticker,
        lifecycle: Lifecycle = new Lifecycle()
    ) {
        this._templates = [];

        this._ticker = ticker;
        this._store = registry;
        this._lifecycle = lifecycle;

        if (this._ticker.initialTemplate && this.templateIsEmpty)
            this.addTemplate(this._ticker.initialTemplate);
    }

    get templateIsEmpty() {
        return this._templates.length === 0;
    }

    // register a template
    addTemplate(template: Template) {
        this._templates.push(template);
    }

    removeTemplate(selectedTemplate: Template, restore?: boolean) {
        this._templates = this._templates.filter((currTemplate: Template) => {
            if (currTemplate !== selectedTemplate) {
                if (restore) currTemplate.restore();
                return currTemplate;
            }
        });

        this._templateIndex = -1;
    }

    clearTemplates() {
        for (const template of this._templates) {
            this.removeTemplate(template);
        }
    }

    // return next template that will be used to clone
    getNextTemplate(): Template {
        if (this._templateIndex + 1 >= this._templates.length)
            this._templateIndex = 0;
        else this._templateIndex++;

        return this._templates[this._templateIndex];
    }

    // create a single instance
    create(n: number): TickerItem[] {
        const items: TickerItem[] = [];

        if (this._templates.length > 0) {
            for (let i = 0; i < n; i++) {
                const item = new TickerItem(
                    this.getNextTemplate(),
                    this._lifecycle
                );

                item.registerStore(this._store);
                items.push(item);
            }
            for (const item of items) {
                this._ticker.append(item);
            }
        }

        return items;
    }

    // create a sequence
    sequence(options?: { continue?: boolean }): TickerItem[] {
        let prevTemplateIndex = this._templateIndex;
        this._templateIndex = 0;

        let items: TickerItem[] = this.create(this._templates.length);

        if (options?.continue) this._templateIndex = prevTemplateIndex;

        return items;
    }
}
