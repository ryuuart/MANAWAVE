export interface SizeListener {
    onSizeUpdate: (entry: ResizeObserverEntry) => void;
}

abstract class MultiObserver<Key, Listener> {
    protected records: Map<Key, Set<Listener>>;

    constructor() {
        this.records = new Map<Key, Set<Listener>>();
    }

    connect(k: Key, l: Listener) {
        let r = this.records.get(k);
        if (r !== undefined) {
            r.add(l);
        } else {
            this.records.set(k, new Set<Listener>([l]));
        }
    }

    disconnect(k: Key, l: Listener) {
        const r = this.records.get(k);
        r?.delete(l);
        if (r?.size === 0) this.records.delete(k);
    }

    destroy() {
        for (const listeners of this.records.values()) {
            listeners.clear();
        }
        this.records.clear();
    }

    takeRecords() {
        return [...this.records];
    }
}

class MultiResizeObserver extends MultiObserver<Element, SizeListener> {
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

    override connect(k: Element, l: SizeListener): void {
        super.connect(k, l);

        this.#resizeObserver.observe(k);
    }

    override disconnect(k: Element, l: SizeListener): void {
        super.disconnect(k, l);

        if (!this.records.has(k)) {
            this.#resizeObserver.unobserve(k);
        }
    }

    override destroy(): void {
        super.destroy();

        this.#resizeObserver.disconnect();
    }
}

export const multiResizeObserver = new MultiResizeObserver();
