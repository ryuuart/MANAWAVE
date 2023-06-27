export class Scene<T> {
    private _store: Set<T>;
    private _sizes: Ticker.Sizes;

    constructor(sizes?: Ticker.Sizes) {
        this._store = new Set();

        // hard-coded sizes because these are the only global sizes we'll have
        this._sizes = {
            ticker: { width: 0, height: 0 },
            item: { width: 0, height: 0 },
        };

        if (sizes) this._sizes = structuredClone(sizes);
    }

    /**
     * Get an iterable of the container's current content
     */
    get contents(): IterableIterator<T> {
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
    get sizes(): Ticker.Sizes {
        return structuredClone(this._sizes);
    }

    /**
     * Updates the current shared size of all scene objects
     */
    set sizes(sizes: Partial<Ticker.Sizes>) {
        Object.assign(this._sizes, structuredClone(sizes));
    }

    /**
     * Adds a given object into the container
     * @param object object to add into the container
     */
    add(object: T) {
        this._store.add(object);
    }

    /**
     * Checks if a given object is in the container
     * @param object observed object
     * @returns if observed object is found or not
     */
    has(object: T): boolean {
        return this._store.has(object);
    }

    /**
     * Removes an object in the container.
     *
     * @remark If the object is a reference (class or object), it
     * will delete only if the reference is in the container.
     *
     * If you want to remove a matching object, use {@link find | Container.find } to
     * get these references.
     *
     * @param object an object in the container
     */
    delete(object: T) {
        this._store.delete(object);
    }

    /**
     * Finds a list of objects that match the provided predicate or criteria.
     * @param callback a predicate ran against all objects in the container
     * @returns a list of found objects
     */
    find(callback: (object: T) => boolean): T[] {
        const objects: T[] = [];
        for (const object of this._store) {
            if (callback(object)) objects.push(object);
        }

        return objects;
    }
}

/**
 * Clears all contents of a container
 * @param container a container with any number of objects inside
 */
export function clearScene<T>(container: Scene<T>) {
    const contents = container.contents;
    for (const object of contents) {
        container.delete(object);
    }
}
