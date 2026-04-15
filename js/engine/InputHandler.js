export class InputHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.directionCallback = null;
        this.touchStartX = 0;
        this.touchStartY = 0;

        this.bindKeyboard();
        this.bindTouch();
    }

    onDirectionChange(callback) {
        this.directionCallback = callback;
    }

    emit(axis, value) {
        if (this.directionCallback) {
            this.directionCallback({ axis, value });
        }
    }

    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            switch (e.key) {
                case 'ArrowUp':    case 'w': case 'W':
                    this.emit('y', -1);
                    e.preventDefault();
                    break;
                case 'ArrowDown':  case 's': case 'S':
                    this.emit('y', 1);
                    e.preventDefault();
                    break;
                case 'ArrowLeft':  case 'a': case 'A':
                    this.emit('x', -1);
                    e.preventDefault();
                    break;
                case 'ArrowRight': case 'd': case 'D':
                    this.emit('x', 1);
                    e.preventDefault();
                    break;
            }
        });
    }

    bindTouch() {
        this.canvas.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - this.touchStartX;
            const dy = e.changedTouches[0].clientY - this.touchStartY;

            if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

            if (Math.abs(dx) > Math.abs(dy)) {
                this.emit('x', dx > 0 ? 1 : -1);
            } else {
                this.emit('y', dy > 0 ? 1 : -1);
            }
            e.preventDefault();
        }, { passive: false });
    }
}
