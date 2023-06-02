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

export default class TickerState {
    private _prevState: TickerStateSchema;
    private _state: TickerStateSchema;

    constructor() {
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
    }

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
