import { COLS, ROWS } from '../config.js';

export class Fruit {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.pulse = 0;
    }

    place(isOccupied) {
        let pos;
        let tries = 0;
        do {
            pos = {
                x: Math.floor(Math.random() * COLS),
                y: Math.floor(Math.random() * ROWS),
            };
            tries++;
        } while (tries < 500 && isOccupied(pos.x, pos.y));
        this.x = pos.x;
        this.y = pos.y;
        this.pulse = 0;
    }

    isAt(x, y) {
        return this.x === x && this.y === y;
    }
}
