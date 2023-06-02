type TickerStateSchema = {
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

/**
 * Represents the active state of a ticker
 */
export default class TickerState {
    private _prevState: TickerStateSchema;
    private _state: TickerStateSchema;

    /**
     * Only sets the default state
     */
    constructor(initialState?: Partial<TickerStateSchema>) {
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

        this._prevState = structuredClone(blank);
        this._state = structuredClone(blank);

        if (initialState) this.update(initialState);
    }

    /**
     * Updates and overrides current state with new values
     *
     * @remark describing the entire state isn't need. You can describe
     * a new state partially and it will only update what is required.
     *
     * @param newState any new changes to the state
     */
    update(newState: Partial<TickerStateSchema>) {
        this._prevState = structuredClone(this._state);
        Object.assign(this._state, newState);
    }

    get current(): TickerStateSchema {
        return this._state;
    }

    get previous(): TickerStateSchema {
        return this._prevState;
    }
}
