export interface SizeListener {
    onSizeUpdate: (entry: ResizeObserverEntry) => void;
}

export interface DomNodeListener {
    onDomNodeUpdate: (entry: MutationRecord) => void;
}

/**
 * Traditional observer that will be used to notify listeners. The multi-
 * means that listeners are bundled into sets and associated with a target.
 */
abstract class MappedObserver<Target, Listener> {
    protected records: Map<Target, Set<Listener>>;

    constructor() {
        this.records = new Map<Target, Set<Listener>>();
    }

    /**
     * Connect and add a listener to a given target. The listener
     * will be notified of changes over time.
     * @param k group to associate listeners with
     * @param l object that will be notified to
     */
    connect(k: Target, l: Listener) {
        let r = this.records.get(k);
        if (r !== undefined) {
            r.add(l);
        } else {
            this.records.set(k, new Set<Listener>([l]));
        }
    }

    /**
     * Disconnect a listener to a given target. The listener
     * will **not** be notified of changes over time anymore.
     * @param k group to associate listeners with
     * @param l object that will be notified to
     */
    disconnect(k: Target, l: Listener) {
        const r = this.records.get(k);
        r?.delete(l);
        if (r?.size === 0) this.records.delete(k);
    }

    /**
     * Disconnect all listeners and targets from the observer.
     */
    destroy() {
        for (const listeners of this.records.values()) {
            listeners.clear();
        }
        this.records.clear();
    }
}

/**
 * Wrapped ResizeObserver that can notify listeners of Element size changes. Each Element
 * has a set of listeners that are listening to the current size of the Element.
 *
 * This is a **singleton**.
 */
class MappedResizeObserver extends MappedObserver<Element, SizeListener> {
    #resizeObserver: ResizeObserver;

    #resizeCallback(entries: ResizeObserverEntry[]) {
        for (const entry of entries) {
            const el = entry.target;
            const listeners = this.records.get(el);
            if (listeners !== undefined) {
                for (const l of listeners) {
                    l.onSizeUpdate(entry);
                }
            }
        }
    }

    constructor() {
        super();

        this.#resizeObserver = new ResizeObserver(
            this.#resizeCallback.bind(this)
        );
    }

    /**
     * Connect a listener to a DOM element and observe size changes.
     * @param k DOM Element to associate listeners to
     * @param l listener that will receive Element size changes
     */
    override connect(k: Element, l: SizeListener): void {
        super.connect(k, l);

        this.#resizeObserver.observe(k);
    }

    /**
     * Remove a listener from the DOM Element. The listener won't be notified
     * of any more size changes. If there aren't any more listeners,
     * the observer stops listening to the Element.
     * @param k DOM Element that has listener to be removed
     * @param l listener that received Element size changes
     */
    override disconnect(k: Element, l: SizeListener): void {
        super.disconnect(k, l);

        if (!this.records.has(k)) {
            this.#resizeObserver.unobserve(k);
        }
    }

    /**
     * Remove all listeners and elements. Don't observe or notify anything anymore.
     */
    override destroy(): void {
        super.destroy();

        this.#resizeObserver.disconnect();
    }
}

// https://github.com/whatwg/dom/issues/126#issuecomment-1049814948
class UnobservableMutationObserver extends MutationObserver {
    #observerTargets: Array<{
        target: Node;
        options?: MutationObserverInit;
    }> = [];
    #callback: MutationCallback;

    constructor(callback: MutationCallback) {
        super(callback);

        this.#callback = callback;
    }

    override observe(target: Node, options?: MutationObserverInit): void {
        this.#observerTargets.push({ target, options });

        return super.observe(target, options);
    }

    unobserve(target: Node): void {
        const newObserverTargets = this.#observerTargets.filter(
            (ot) => ot.target !== target
        );
        this.#observerTargets = [];

        const queuedEntries = this.takeRecords();
        if (queuedEntries.length > 0) {
            this.#callback(queuedEntries, this);
        }

        this.disconnect();

        newObserverTargets.forEach((ot) => {
            this.observe(ot.target, ot.options);
        });
    }
}

class MappedMutationObserver extends MappedObserver<Node, DomNodeListener> {
    #mutationObserver: UnobservableMutationObserver;
    #mutationCallback(entries: MutationRecord[]) {
        for (const entry of entries) {
            const el = entry.target;
            const listeners = this.records.get(el);
            if (listeners !== undefined) {
                for (const l of listeners) {
                    l.onDomNodeUpdate(entry);
                }
            }
        }
    }

    constructor() {
        super();

        this.#mutationObserver = new UnobservableMutationObserver(
            this.#mutationCallback.bind(this)
        );
    }

    /**
     * Connect a listener to a DOM element and observe node changes.
     * @param k DOM Element to associate listeners to
     * @param l listener that will receive Element node changes
     */
    override connect(
        k: Element,
        l: DomNodeListener,
        options?: MutationObserverInit
    ): void {
        super.connect(k, l);

        this.#mutationObserver.observe(k, options);
    }

    /**
     * Remove a listener from the DOM Element. The listener won't be notified
     * of any more node changes. If there aren't any more listeners,
     * the observer stops listening to the Element.
     * @param k DOM Element that has listener to be removed
     * @param l listener that received Element node changes
     */
    override disconnect(k: Element, l: DomNodeListener): void {
        super.disconnect(k, l);

        if (!this.records.has(k)) {
            this.#mutationObserver.unobserve(k);
        }
    }

    /**
     * Remove all listeners and elements. Don't observe or notify anything anymore.
     */
    override destroy(): void {
        super.destroy();

        this.#mutationObserver.disconnect();
    }
}

export const mappedResizeObserver = new MappedResizeObserver();
export const mappedMutationObserver = new MappedMutationObserver();
