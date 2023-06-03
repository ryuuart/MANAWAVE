import { getRepetitions } from "@ouroboros/dom/measure";
import { TickerStateData } from "./state";
import { accumulateVec2, normalize, toRadians } from "./math";
import { Item, extractPosition } from "./item";

type TSimulationContext = {
    ticker: { size: Rect };
    item: { size: Rect };
    limits: DirectionalCount;
    intendedDirection: vec2;
    actualDirection: vec2;
    speed: number;
};

type TSimulationSample = {
    ticker: TSimulationContext["ticker"];
    item: TSimulationContext["item"];
    direction: TSimulationContext["intendedDirection"];
    speed: TSimulationContext["speed"];
};

type TSimulationData = {
    tState: TickerStateData;
    dt: DOMHighResTimeStamp;
    t: DOMHighResTimeStamp;
};

function getTLimits(ticker: Rect, item: Rect): DirectionalCount {
    const limits = getRepetitions(ticker, item);
    limits.horizontal *= ticker.width;
    limits.vertical *= item.height;

    return limits;
}

function makeDirectionAccumulator() {
    const accumulate = accumulateVec2({ x: 0, y: 0 });

    return function (prevPos: vec2, currPos: vec2): vec2 {
        const delta = { x: currPos.x - prevPos.x, y: currPos.y - prevPos.y };
        return accumulate(delta);
    };
}

function moveItem(
    item: Item,
    { intendedDirection, speed }: TSimulationContext
) {
    // directions should not have any magnitude and should be normalized
    const normalizedDirection = normalize(intendedDirection);

    item.x += 1 * speed * normalizedDirection.x;
    item.y += 1 * speed * normalizedDirection.y;
}

function loopItem(item: Item, context: TSimulationContext) {
    const itemSize = context.item.size;

    const { actualDirection, limits } = context;
    if (actualDirection.x > 0 && item.x >= limits.horizontal) {
        item.x = -itemSize.width;
    } else if (actualDirection.x < 0 && item.x <= -itemSize.width) {
        item.x = limits.horizontal;
    }
    if (actualDirection.y > 0 && item.y >= limits.vertical) {
        item.y = -itemSize.height;
    } else if (actualDirection.y < 0 && item.y <= -itemSize.height) {
        item.y = limits.vertical;
    }
}

export function simulateItem(
    item: Item,
    data: TSimulationData,
    override?: (sample: TSimulationSample) => void
) {
    const state = data.tState;
    const sTicker = state.ticker;
    const sItem = state.item;

    const tContext: TSimulationContext = {
        ticker: sTicker,
        item: sItem,
        limits: getTLimits(sTicker.size, sItem.size),
        intendedDirection: {
            x: Math.cos(toRadians(state.direction)),
            y: Math.sin(toRadians(state.direction)),
        },
        speed: state.speed,
        actualDirection: { x: 0, y: 0 },
    };

    const accumulateDirection = makeDirectionAccumulator();
    const initialPosition = extractPosition(item);

    // TODO: override hook here

    tContext.actualDirection = accumulateDirection(
        initialPosition,
        extractPosition(item)
    );

    moveItem(item, tContext);

    tContext.actualDirection = accumulateDirection(
        tContext.actualDirection,
        extractPosition(item)
    );

    loopItem(item, tContext);

    item.lifetime += data.dt;
}
