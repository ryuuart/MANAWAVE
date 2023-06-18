import { Component } from "./component";

/**
 * Contains tree of components
 */
export default class Scene {
    private _components: Map<string, Component>;

    constructor() {
        this._components = new Map();
    }

    get contents(): IterableIterator<Component> {
        return this._components.values();
    }

    /**
     * Retrieves a component given an ID
     * @param id the id of the component
     * @returns the component if there is one
     */
    get(id: string) {
        return this._components.get(id);
    }

    /**
     * Return whether or not a specified {@link Component} exists in the {@link Scene} or not
     *
     * @param selection a component ID or {@link Component} to search for
     * @returns true if a component exists in the scene
     */
    has(selection: string | Component) {
        if (selection instanceof Component)
            return this._components.has(selection.id);
        else return this._components.has(selection);
    }

    /**
     * Add or set a component in the scene.
     * @param component a component to update or add in the scene
     */
    set(component: Component) {
        this._components.set(component.id, component);
    }

    /**
     * Removes the selected {@link Component} from the scene if it exists.
     * @param selection a component ID or {@link Component}
     */
    remove(selection: string | Component) {
        if (selection instanceof Component)
            this._components.delete(selection.id);
        else this._components.delete(selection);
    }
}
