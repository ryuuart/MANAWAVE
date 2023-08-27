import { Item } from "./item";

export class Scene {
    private _store: Set<Item>;

    // the size of the entire scene which the items are positioned in
    private _size: Rect;

    constructor() {
        this._store = new Set();
        this._size = { width: 0, height: 0 };
    }

    /**
     * Get an iterable of the scene's current content
     */
    get contents(): IterableIterator<Item> {
        return this._store.values();
    }

    /**
     * Get total objects in this scene
     */
    get length(): number {
        return this._store.size;
    }

    /**
     * Get the current shared size of all scene objects
     */
    get size(): Rect {
        return this._size;
    }

    /**
     * Updates the current shared size of all scene objects
     */
    set size(sizes: Rect) {
        this._size = sizes;
    }

    /**
     * Adds a given object into the scene
     * @param object object to add into the scene
     */
    add(object: Item) {
        this._store.add(object);
    }

    /**
     * Checks if a given object is in the scene
     * @param object observed object
     * @returns if observed object is found or not
     */
    has(object: Item): boolean {
        return this._store.has(object);
    }

    /**
     * Removes an object in the scene.
     *
     * @remark If the object is a reference (class or object), it
     * will delete only if the reference is in the scene.
     *
     * If you want to remove a matching object, use {@link find | Container.find } to
     * get these references.
     *
     * @param object an object in the scene
     */
    delete(object: Item) {
        this._store.delete(object);
    }

    /**
     * Clears all contents of a scene
     * @param scene a scene with any number of objects inside
     */
    clear() {
        for (const object of this._store) {
            this._store.delete(object);
        }
    }

    /**
     * Finds a list of objects that match the provided predicate or criteria.
     * @param callback a predicate ran against all objects in the scene
     * @returns a list of found objects
     */
    find(callback: (object: Item) => boolean): Item[] {
        const objects: Item[] = [];
        for (const object of this._store) {
            if (callback(object)) objects.push(object);
        }

        return objects;
    }
}
