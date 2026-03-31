import { COLS, ROWS, CANVAS_W, CANVAS_H, DIFFICULTY } from "../config.js";
import { Snake } from "../entities/Snake.js";
import { Fruit } from "../entities/Fruit.js";
import { ObstacleManager } from "../entities/Obstacle.js";
import { Renderer } from "../rendering/Renderer.js";
import { InputHandler } from "./InputHandler.js";
import { ScreenManager } from "../screens/ScreenManager.js";
import { Storage } from "../utils/Storage.js";

export class Game {
  constructor() {
    // Canvas
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_H;

    // DOM elements
    this.scoreEl = document.getElementById("score");
    this.highScoreEl = document.getElementById("high-score");
    this.levelEl = document.getElementById("level");
    this.finalScoreEl = document.getElementById("final-score");
    this.newHighEl = document.getElementById("new-high");

    // Systems
    this.screens = new ScreenManager();
    this.renderer = new Renderer(this.ctx);
    this.input = new InputHandler(this.canvas);

    // Entities
    this.snake = new Snake();
    this.fruit = new Fruit();
    this.obstacles = new ObstacleManager();

    // State
    this.score = 0;
    this.highScore = Storage.getHighScore();
    this.alive = false;
    this.loopId = null;
    this.difficulty = "easy";
    this.speed = 130;

    // Init
    this.highScoreEl.textContent = this.highScore;
    this.setupInput();
    this.setupButtons();
    this.screens.show("start");
  }

  //Setup

  setupInput() {
    this.input.onDirectionChange(({ axis, value }) => {
      if (!this.alive) return;
      const dir = this.snake.direction;
      if (axis === "x" && dir.x !== -value) {
        this.snake.setDirection({ x: value, y: 0 });
      } else if (axis === "y" && dir.y !== -value) {
        this.snake.setDirection({ x: 0, y: value });
      }
    });
  }

  setupButtons() {
    document.querySelectorAll("[data-difficulty]").forEach((btn) => {
      btn.addEventListener("click", () => this.start(btn.dataset.difficulty));
    });
    document.querySelector(".btn-restart").addEventListener("click", () => {
      this.start(this.difficulty);
    });
    document.querySelector(".btn-menu").addEventListener("click", () => {
      this.screens.show("start");
    });
  }

  //Helpers

  isOccupied(x, y, skipFruit = false) {
    if (this.snake.occupies(x, y)) return true;
    if (this.obstacles.occupies(x, y)) return true;
    if (this.snake.nearHead(x, y)) return true;
    if (!skipFruit && this.fruit.isAt(x, y)) return true;
    return false;
  }

  //Game Flow

  start(diff) {
    this.difficulty = diff;
    const cfg = DIFFICULTY[diff];
    this.speed = cfg.speed;
    this.levelEl.textContent = cfg.label;

    this.snake.reset();
    this.score = 0;
    this.alive = true;
    this.scoreEl.textContent = "0";

    this.obstacles.generate(cfg.obstacleCount, (x, y) =>
      this.isOccupied(x, y, true),
    );
    this.fruit.place((x, y) => this.isOccupied(x, y, false));

    this.screens.show("game");
    if (this.loopId) clearTimeout(this.loopId);
    this.loop();
  }

  loop() {
    if (!this.alive) return;

    this.update();
    this.draw();

    this.loopId = setTimeout(() => this.loop(), this.speed);
  }

  //Update

  update() {
    const head = this.snake.getNextHead();

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      return this.gameOver();
    }

    // Self collision
    if (this.snake.collidesAt(head.x, head.y)) {
      return this.gameOver();
    }

    // Obstacle collision
    if (this.obstacles.occupies(head.x, head.y)) {
      return this.gameOver();
    }

    this.snake.applyMove(head);

    // Eat fruit
    if (this.fruit.isAt(head.x, head.y)) {
      this.score++;
      this.scoreEl.textContent = this.score;
      this.fruit.place((x, y) => this.isOccupied(x, y, false));

      // Speed up every 5 points
      if (this.score % 5 === 0 && this.speed > 40) {
        this.speed -= 5;
      }

      // Add obstacles every 8 points on medium/hard
      if (this.difficulty !== "easy" && this.score % 8 === 0) {
        this.obstacles.addRandom((x, y) => this.isOccupied(x, y, false));
      }
    } else {
      this.snake.removeTail();
    }
  }

  //Draw

  draw() {
    this.renderer.drawBackground();
    this.renderer.drawObstacles(this.obstacles);
    this.renderer.drawFruit(this.fruit);
    this.renderer.drawSnake(this.snake);
  }

  //Game Over

  gameOver() {
    this.alive = false;
    clearTimeout(this.loopId);

    const isNewHigh = this.score > this.highScore;
    if (isNewHigh) {
      this.highScore = this.score;
      Storage.setHighScore(this.highScore);
      this.highScoreEl.textContent = this.highScore;
    }

    this.finalScoreEl.textContent = `Score: ${this.score}`;
    this.newHighEl.classList.toggle("hidden", !isNewHigh);

    setTimeout(() => this.screens.show("over"), 400);
  }
}
