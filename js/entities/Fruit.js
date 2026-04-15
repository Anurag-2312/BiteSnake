import { COLS, ROWS } from '../config.js';

export class BaseFruit {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.pulse = 0;
        this.type = 'apple';
        this.scoreValue = 1;
        this.spawnWeight = 10;
        this.lifespan = Infinity;
        this.ticksLeft = Infinity;
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

    // Override in subclasses for secondary effects
    effect(_game) {}
}
