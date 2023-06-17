import { Component } from "./component";

export default class Scene {
    private _components: Map<string, Component>;

    constructor() {
        this._components = new Map();
    }

    get contents(): IterableIterator<Component> {
        return this._components.values();
    }

    get(id: string) {
        return this._components.get(id);
    }

    has(selection: string | Component) {
        if (selection instanceof Component)
            return this._components.has(selection.id);
        else return this._components.has(selection);
    }

    set(component: Component) {
        this._components.set(component.id, component);
    }

    remove(selection: string | Component) {
        if (selection instanceof Component)
            this._components.delete(selection.id);
        else this._components.delete(selection);
    }
}
