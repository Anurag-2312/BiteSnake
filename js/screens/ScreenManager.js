export class ScreenManager {
    constructor() {
        this.screens = {
            start: document.getElementById('start-screen'),
            game:  document.getElementById('game-screen'),
            over:  document.getElementById('gameover-screen'),
        };
    }

    show(name) {
        Object.values(this.screens).forEach(s => s.classList.add('hidden'));
        this.screens[name].classList.remove('hidden');
    }
}
