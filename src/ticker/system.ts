import { System } from "@ouroboros/anim";
import { Container, clearContainer } from "./container";
import { Item } from "./item";
import TickerState from "./state";
import { getRepetitions } from "@ouroboros/dom/measure";
import { layoutGrid } from "./layout";
import { toRadians } from "./math";

export default class TickerSystem extends System {
    state: TickerState;
    container: Container<Item>;

    constructor(state: TickerState) {
        super();

        this.container = new Container();
        this.state = state;
    }

    onStart() {
        const repetitions = getRepetitions(
            this.state.current.ticker.size,
            this.state.current.item.size
        );
        repetitions.horizontal += 2;
        repetitions.vertical += 2;

        const totalRepetitions = repetitions.horizontal * repetitions.vertical;

        for (let i = 0; i < totalRepetitions; i++) {
            this.container.add(new Item());
        }

        layoutGrid(this.container, {
            grid: this.state.current.ticker,
            item: this.state.current.item,
            repetitions: repetitions,
            offset: {
                x: -this.state.current.item.size.width,
                y: -this.state.current.item.size.height,
            },
        });
    }

    onStop() {
        clearContainer(this.container);
    }

    onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp) {
        for (const item of this.container.contents) {
            item.lifetime += dt;

            let itemState = {
                dt,
                t,
                direction: {
                    x: Math.cos(toRadians(this.state.current.direction)),
                    y: Math.sin(toRadians(this.state.current.direction)),
                },
                position: {
                    x: item.x,
                    y: item.y,
                },
            };

            const initialPosition = itemState.position;

            // if (this._onItemUpdated) {
            //     Object.assign(itemState, this._onItemUpdated(itemState));
            // }

            const actualDirection = {
                x: itemState.position.x - initialPosition.x,
                y: itemState.position.y - initialPosition.y,
            };

            const normalizedDirection = {
                x:
                    itemState.direction.x /
                    Math.sqrt(
                        itemState.direction.x ** 2 + itemState.direction.y ** 2
                    ),
                y:
                    itemState.direction.y /
                    Math.sqrt(
                        itemState.direction.x ** 2 + itemState.direction.y ** 2
                    ),
            };

            const tickerSize = this.state.current.ticker.size;
            const itemSize = this.state.current.item.size;
            const speed = this.state.current.speed;

            item.x = itemState.position.x + 1 * speed * normalizedDirection.x;
            item.y = itemState.position.y + 1 * speed * normalizedDirection.y;

            actualDirection.x = item.x - actualDirection.x;
            actualDirection.y = item.y - actualDirection.y;

            const xLim =
                Math.ceil(tickerSize.width / itemSize.width) * itemSize.width;
            const yLim =
                Math.ceil(tickerSize.height / itemSize.height) *
                itemSize.height;

            if (actualDirection.x > 0 && item.x >= xLim) {
                item.x = -itemSize.width;
            } else if (actualDirection.x < 0 && item.x <= -itemSize.width) {
                item.x = xLim;
            }
            if (actualDirection.y > 0 && item.y >= yLim) {
                item.y = -itemSize.height;
            } else if (actualDirection.y < 0 && item.y <= -itemSize.height) {
                item.y = yLim;
            }
        }
    }

    onDraw() {}
}
