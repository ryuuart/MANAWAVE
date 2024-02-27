interface Listener {
    onUpdate: () => void;
}

export interface SizeListener {
    onSizeUpdate: (entry: ResizeObserverEntry) => void;
}

abstract class Observer<Listener> {
    protected records: Map<Listener, Listener>;

    constructor() {
        this.records = new Map<Listener, Listener>();
    }

    connect(l: Listener) {
        this.records.set(l, l);
    }

    disconnect(l: Listener) {
        this.records.delete(l);
    }

    destroy() {
        this.records.clear();
    }

    takeRecords() {
        return [...this.records];
    }
}

export class SizeObserver extends Observer<SizeListener> {
    #resizeObserver: ResizeObserver;

    #resizeCallback(entries: ResizeObserverEntry[]) {
        for (const entry of entries) {
            for (const record of this.records.values()) {
                record.onSizeUpdate(entry);
            }
        }
    }

    constructor(el: HTMLElement) {
        super();

        this.#resizeObserver = new ResizeObserver(
            this.#resizeCallback.bind(this)
        );
        this.#resizeObserver.observe(el);
    }

    override destroy(): void {
        super.destroy();

        this.#resizeObserver.disconnect();
    }
}
