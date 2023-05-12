import { System } from "@billboard/lib";

class BlankSystem extends System {
    dt: DOMHighResTimeStamp;
    t: DOMHighResTimeStamp;
    stringCanvas: string;

    constructor() {
        super();

        this.dt = 0;
        this.t = 0;

        this.stringCanvas = "not rendered";
    }

    onUpdate(dt: DOMHighResTimeStamp, t: DOMHighResTimeStamp): void {
        this.dt = dt;
        this.t = t;
    }

    onDraw(): void {
        this.stringCanvas = "rendered";
    }
}

describe("system", () => {
    it("should invoke onUpdate on update", async () => {
        const system = new BlankSystem();
        system.start();

        system.update(10, 10);

        expect(system.t).toEqual(10);
        expect(system.dt).toEqual(10);

        system.stop();
    });

    it("should invoke onDraw on draw", async () => {
        const system = new BlankSystem();
        system.start();

        system.draw();

        expect(system.stringCanvas).toEqual("rendered");

        system.stop();
    });
});

// No tests for controller since all logic is encapsulated
// Testing the controller means testing other components which
// is done in anim/__test__/integration
