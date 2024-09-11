export class inputController {
    constructor() {
        this.init();
    }

    init() {
        this.keys = {};
        this.isMoving = false;

        document.addEventListener("keydown", (e) => this.keyDown(e));
        document.addEventListener("keyup", (e) => this.keyUp(e));
    }

    keyDown({key}) {
        this.keys[key] = true;
        this.isMoving = true;
    }

    keyUp({key}) {
        this.keys[key] = false;
        this.isMoving = false;
    }
}