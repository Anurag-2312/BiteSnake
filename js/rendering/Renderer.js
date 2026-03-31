import { CELL_SIZE, COLS, ROWS, CANVAS_W, CANVAS_H } from "../config.js";

export class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  //Background
  drawBackground() {
    const ctx = this.ctx;

    ctx.fillStyle = "#0f0f23";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, CANVAS_H);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(CANVAS_W, y * CELL_SIZE);
      ctx.stroke();
    }
  }

  //Snake
  drawSnake(snake) {
    const ctx = this.ctx;
    const segments = snake.segments;
    const len = segments.length;

    for (let i = len - 1; i >= 0; i--) {
      const seg = segments[i];
      const t = len > 1 ? i / (len - 1) : 0;
      const px = seg.x * CELL_SIZE;
      const py = seg.y * CELL_SIZE;
      const pad = 1;

      const r = Math.round(0 + t * 0);
      const g = Math.round(230 - t * 100);
      const b = Math.round(100 + t * 80);

      if (i === 0) {
        ctx.shadowColor = "rgba(0, 255, 135, 0.6)";
        ctx.shadowBlur = 12;
      }

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      this.roundRect(
        px + pad,
        py + pad,
        CELL_SIZE - pad * 2,
        CELL_SIZE - pad * 2,
        5,
      );
      ctx.fill();

      ctx.fillStyle = `rgba(255, 255, 255, ${0.15 - t * 0.1})`;
      this.roundRect(
        px + pad + 2,
        py + pad + 2,
        CELL_SIZE - pad * 2 - 6,
        CELL_SIZE / 2 - 2,
        3,
      );
      ctx.fill();

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      if (i === 0) {
        this.drawEyes(seg, snake.direction);
      }
    }
  }

  drawEyes(head, direction) {
    const ctx = this.ctx;
    const cx = head.x * CELL_SIZE + CELL_SIZE / 2;
    const cy = head.y * CELL_SIZE + CELL_SIZE / 2;

    let offsets;
    if (direction.x === 1)
      offsets = [
        { x: 4, y: -4 },
        { x: 4, y: 4 },
      ];
    else if (direction.x === -1)
      offsets = [
        { x: -4, y: -4 },
        { x: -4, y: 4 },
      ];
    else if (direction.y === -1)
      offsets = [
        { x: -4, y: -4 },
        { x: 4, y: -4 },
      ];
    else
      offsets = [
        { x: -4, y: 4 },
        { x: 4, y: 4 },
      ];

    for (const off of offsets) {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(cx + off.x, cy + off.y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(
        cx + off.x + direction.x * 1.2,
        cy + off.y + direction.y * 1.2,
        1.8,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  //Fruit
  drawFruit(fruit) {
    const ctx = this.ctx;
    fruit.pulse += 0.08;
    const pulse = 1 + Math.sin(fruit.pulse) * 0.1;
    const cx = fruit.x * CELL_SIZE + CELL_SIZE / 2;
    const cy = fruit.y * CELL_SIZE + CELL_SIZE / 2;
    const radius = (CELL_SIZE / 2 - 2) * pulse;

    ctx.shadowColor = "rgba(255, 50, 50, 0.7)";
    ctx.shadowBlur = 15;

    const grad = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, radius);
    grad.addColorStop(0, "#ff4444");
    grad.addColorStop(0.7, "#cc0000");
    grad.addColorStop(1, "#880000");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.beginPath();
    ctx.arc(cx - 2, cy - 3, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#2d5a1e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius + 2);
    ctx.quadraticCurveTo(cx + 3, cy - radius - 5, cx + 6, cy - radius - 2);
    ctx.stroke();

    ctx.fillStyle = "#4caf50";
    ctx.beginPath();
    ctx.ellipse(cx + 5, cy - radius - 1, 4, 2, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  //Obstacles
  drawObstacles(obstacles) {
    const ctx = this.ctx;

    for (const ob of obstacles.items) {
      const px = ob.x * CELL_SIZE;
      const py = ob.y * CELL_SIZE;

      const grad = ctx.createLinearGradient(
        px,
        py,
        px + CELL_SIZE,
        py + CELL_SIZE,
      );
      grad.addColorStop(0, "#3a3a5c");
      grad.addColorStop(0.5, "#2a2a44");
      grad.addColorStop(1, "#1a1a33");
      ctx.fillStyle = grad;
      this.roundRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2, 3);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 100, 100, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px + 5, py + 5);
      ctx.lineTo(px + CELL_SIZE - 5, py + CELL_SIZE - 5);
      ctx.moveTo(px + CELL_SIZE - 5, py + 5);
      ctx.lineTo(px + 5, py + CELL_SIZE - 5);
      ctx.stroke();
    }
  }

  //Helpers
  roundRect(x, y, w, h, r) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }
}
