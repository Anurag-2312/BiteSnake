import { COLS, ROWS } from '../config.js';

export class Snake {
    constructor() {
        this.segments = [];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
    }

    reset() {
        this.segments = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
    }

    get head() {
        return this.segments[0];
    }

    setDirection(dir) {
        this.nextDirection = dir;
    }

    getNextHead() {
        return {
            x: this.head.x + this.nextDirection.x,
            y: this.head.y + this.nextDirection.y,
        };
    }

    applyMove(newHead) {
        this.direction = { ...this.nextDirection };
        this.segments.unshift(newHead);
    }

    removeTail() {
        this.segments.pop();
    }

    collidesAt(x, y) {
        return this.segments.some(seg => seg.x === x && seg.y === y);
    }

    occupies(x, y) {
        return this.segments.some(seg => seg.x === x && seg.y === y);
    }

    nearHead(x, y, dist = 3) {
        return Math.abs(this.head.x - x) + Math.abs(this.head.y - y) < dist;
    }
}
