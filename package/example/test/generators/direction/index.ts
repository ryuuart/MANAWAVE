import { download, jsonToBinary } from "../download";
import { LiveAttributes, LiveSize } from "@manawave/marquee/context";
import { Simulation } from "@manawave/marquee/simulation";
import { Scene } from "@manawave/marquee/scene";

type Frame = {
    x: string;
    y: string;
};

type SnapshotData = {
    setup: {
        numMotions: number;
        dt: DOMHighResTimeStamp;
        marqueeSize: { width: number; height: number };
        itemSize: { width: number; height: number };
    };
    data: {
        [key: string]: {
            frames: Frame[];
        };
    };
};

const snapshot: SnapshotData = {
    setup: {
        numMotions: 10,
        dt: 10,
        marqueeSize: { width: 10, height: 10 },
        itemSize: { width: 10, height: 10 },
    },
    data: {},
};

const sizes = new LiveSize({
    root: snapshot.setup.marqueeSize,
    item: snapshot.setup.itemSize,
});
const attr = new LiveAttributes({ direction: 0, speed: 1 });
const scene = new Scene();
const simulation = new Simulation(sizes, attr, scene);

for (let theta = 0; theta <= 360; theta++) {
    simulation.updateAttribute({ direction: theta });
    simulation.setup();

    const motionFrames = [];

    let t = 0;
    for (let i = 0; i < snapshot.setup.numMotions; i++) {
        const dt = i * snapshot.setup.dt;
        t += dt;
        simulation.step(dt, t);
    }

    for (const item of scene.contents) {
        motionFrames.push({
            x: item.position.x.toFixed(2),
            y: item.position.y.toFixed(2),
        });
    }

    motionFrames.sort((a, b) => {
        const xOrder = parseFloat(a.x) - parseFloat(b.x);
        return xOrder;
    });

    snapshot.data[theta.toString()] = { frames: motionFrames };
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
