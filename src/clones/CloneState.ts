export default class CloneState {
    position: [x: number, y: number];
    dimensions: { width: number; height: number };

    constructor(position: [x: number, y: number] = [0, 0]) {
        this.position = position;
    }

    setPosition(position: [x: number, y: number]) {
        this.position = position;
    }
}
