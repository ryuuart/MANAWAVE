import { TickerState } from "@ouroboros/ticker/state";
import TickerSystem from "@ouroboros/ticker/system";
import { download, jsonToBinary } from "../download";

type Frame = {
    x: string;
    y: string;
};

type SnapshotData = {
    [key: string]: { frames: Frame[] };
};

const state = new TickerState({
    ticker: {
        size: {
            width: 10,
            height: 10,
        },
    },
    item: {
        size: {
            width: 10,
            height: 10,
        },
    },
    direction: 0,
});

const system = new TickerSystem(state);
const snapshot: SnapshotData = {};

for (let theta = 0; theta <= 360; theta++) {
    state.update({ direction: theta });

    system.start();

    const motionFrames = [];

    let t = 0;
    for (let i = 0; i < 10; i++) {
        const dt = i * 10;
        t += dt;
        system.update(dt, t);
    }

    for (const item of system.container.contents) {
        motionFrames.push({
            x: item.position.x.toFixed(2),
            y: item.position.y.toFixed(2),
        });
    }

    motionFrames.sort((a, b) => {
        const xOrder = parseFloat(a.x) - parseFloat(b.x);
        return xOrder;
    });

    system.stop();

    snapshot[theta.toString()] = { frames: motionFrames };
}

const snapshotBinary = jsonToBinary(snapshot);

window.addEventListener("load", function () {
    const snapshotElement = document.getElementById("snapshot-text");

    if (snapshotElement) {
        snapshotElement.textContent = JSON.stringify(snapshot, null, 2);
    }

    const snapshotDownloadButton = document.getElementById("snapshot-download");

    if (snapshotDownloadButton) {
        snapshotDownloadButton.addEventListener("click", () => {
            download("all_direction", snapshotBinary);
        });
    }
});
