import { COLS, ROWS } from '../config.js';

export class ObstacleManager {
    constructor() {
        this.items = [];
    }

    reset() {
        this.items = [];
    }

    generate(count, isOccupied) {
        this.items = [];
        for (let i = 0; i < count; i++) {
            let pos;
            let tries = 0;
            do {
                pos = {
                    x: Math.floor(Math.random() * COLS),
                    y: Math.floor(Math.random() * ROWS),
                };
                tries++;
            } while (tries < 200 && isOccupied(pos.x, pos.y));
            if (tries < 200) this.items.push(pos);
        }
    }

    addRandom(isOccupied) {
        let pos;
        let tries = 0;
        do {
            pos = {
                x: Math.floor(Math.random() * COLS),
                y: Math.floor(Math.random() * ROWS),
            };
            tries++;
        } while (tries < 200 && isOccupied(pos.x, pos.y));
        if (tries < 200) this.items.push(pos);
    }

    occupies(x, y) {
        return this.items.some(ob => ob.x === x && ob.y === y);
    }
}
