export type TickerStateData = {
    ticker: {
        size: Rect;
    };
    item: {
        size: Rect;
    };
    direction: number;
    speed: number;
    autoplay: boolean;
};

export type StateMessageList = "update";

/**
 * Represents the active state of a ticker
 */
export class TickerState {
    private _prevState: TickerStateData;
    private _state: TickerStateData;

    /**
     * Only sets the default state
     */
    constructor(initialState?: Partial<TickerStateData>) {
        const blank = {
            ticker: {
                size: {
                    width: 0,
                    height: 0,
                },
            },
            item: {
                size: {
                    width: 0,
                    height: 0,
                },
            },
            direction: 0,
            speed: 1,
            autoplay: false,
        };

        this._state = blank;
        if (initialState) Object.assign(this._state, initialState);

        this._prevState = this._state;
    }

    /**
     * Updates and overrides current state with new values
     *
     * @remark describing the entire state isn't need. You can describe
     * a new state partially and it will only update what is required.
     *
     * @param newState any new changes to the state
     */
    update(newState: Partial<TickerStateData>) {
        this._prevState = structuredClone(this._state);
        Object.assign(this._state, newState);
    }

    get current(): TickerStateData {
        return structuredClone(this._state);
    }

    get previous(): TickerStateData {
        return structuredClone(this._prevState);
    }

    notify(message: StateMessageList, listeners: Listener[]) {
        for (const listener of listeners) {
            if (message === "update")
                listener.onMessage(message, {
                    curr: this.current,
                    prev: this.previous,
                });
        }
    }
}
