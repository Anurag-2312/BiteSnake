export class Storage {
    static getHighScore() {
        return parseInt(localStorage.getItem('snake_high') || '0');
    }

    static setHighScore(score) {
        localStorage.setItem('snake_high', score.toString());
    }
}
