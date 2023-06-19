import TemplateComponent from "./components/template";
import ContainerComponent from "./components/container";
import Scene from "./scene";
import { Container } from "@ouroboros/ticker/container";
import { Item } from "@ouroboros/ticker/item";
import ItemComponent from "./components/item";
import { Component } from "./component";

export default class TickerWorld {
    private _rootElement: HTMLElement;
    private _template: TemplateComponent;
    private _scene: Scene;

    constructor(rootElement: HTMLElement) {
        this._rootElement = rootElement;
        this._scene = new Scene();
        this._template = new TemplateComponent(rootElement.children);
    }

    /**
     * Takes a component and adds it to this world's root dom element
     * @param component component to add to dom from world
     */
    attachToRootHTML(component: Component) {
        component.appendToDOM(this._rootElement);
    }

    /**
     * Creates or fetches a ticker from the world's scene.
     * @param id id of the ticker component
     * @returns the ticker component that should be in the world's scene
     */
    attachTicker(id: string): ContainerComponent {
        // draw the ticker
        let ticker = this._scene.get(id);

        // if it doesn't exist, make it
        if (!ticker) {
            ticker = new ContainerComponent(id);
            this._scene.set(ticker);
        }

        return ticker;
    }

    /**
     * Creates or fetches an item from the world's scene.
     * @param ticker ticker that should contain the item
     * @param item data for item
     * @returns the item component that should be in the world's scene
     */
    attachItem(ticker: ContainerComponent, item: Item): ItemComponent {
        let component = this._scene.get(item.id);

        // it hasnt been created yet
        if (!component) {
            component = new ItemComponent(item.id, item, this._template);

            ticker.append(component);
            this._scene.set(component);
        }

        return component as ItemComponent;
    }

    /**
     * Takes new item data and removes any item that shouldn't
     * be in the world
     * @param container new data for the world
     */
    removeOldItems(container: Container<Item>) {
        for (const component of this._scene.contents) {
            // did we find something?
            const item = container.find((i) => i.id === component.id);

            // if we didnt find anything, then
            // the scene has something that shouldnt exist
            if (!item[0] && component instanceof ItemComponent)
                this._scene.remove(component);
        }
    }
}
