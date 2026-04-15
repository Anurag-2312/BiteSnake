import {
  COLS,
  ROWS,
  CANVAS_W,
  CANVAS_H,
  DIFFICULTY,
  FRUIT_CONFIG,
} from "../config.js";
import { Snake } from "../entities/Snake.js";
import { FruitFactory } from "../entities/FruitTypes.js";
import { ObstacleManager } from "../entities/Obstacle.js";
import { Renderer } from "../rendering/Renderer.js";
import { InputHandler } from "./InputHandler.js";
import { ScreenManager } from "../screens/ScreenManager.js";
import { Storage } from "../utils/Storage.js";
import * as LeaderboardAPI from "../network/LeaderboardAPI.js";

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
    this.fruits = [];
    this.obstacles = new ObstacleManager();

    // State
    this.score = 0;
    this.highScore = Storage.getHighScore();
    this.alive = false;
    this.loopId = null;
    this.difficulty = "easy";
    this.speed = 130;
    this.baseSpeed = 130;
    this.skipSpeedUp = false;
    this.spawnTimer = 0;

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

    document
      .querySelector(".btn-leaderboard")
      .addEventListener("click", () => this.showLeaderboard("easy"));

    document
      .querySelector(".btn-lb-back")
      .addEventListener("click", () => this.screens.show("start"));

    document.querySelectorAll(".lb-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document
          .querySelectorAll(".lb-tab")
          .forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        this.showLeaderboard(tab.dataset.filter);
      });
    });
  }

  //Helpers

  isOccupied(x, y, skipFruits = false) {
    if (this.snake.occupies(x, y)) return true;
    if (this.obstacles.occupies(x, y)) return true;
    if (this.snake.nearHead(x, y)) return true;
    if (!skipFruits && this.fruits.some((f) => f.isAt(x, y))) return true;
    return false;
  }

  // Lifespan shrinks as score rises — harder at high scores
  getSpecialLifespan() {
    const base = FRUIT_CONFIG[this.difficulty].lifespan;
    const reduction = Math.floor(this.score / 10) * 3;
    return Math.max(20, base - reduction);
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
    this.baseSpeed = cfg.speed;
    this.skipSpeedUp = false;
    this.fruits = [];
    this.spawnTimer = 0;
    this.scoreEl.textContent = "0";

    this.obstacles.generate(cfg.obstacleCount, (x, y) =>
      this.isOccupied(x, y, true),
    );

    // Apple is always present from the start
    this.fruits.push(
      FruitFactory.spawnApple((x, y) => this.isOccupied(x, y, false)),
    );

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

    // Check if head landed on any fruit
    const eatenIdx = this.fruits.findIndex((f) => f.isAt(head.x, head.y));
    if (eatenIdx !== -1) {
      const eaten = this.fruits.splice(eatenIdx, 1)[0];

      const oldScore = this.score;
      this.score = Math.max(0, this.score + eaten.scoreValue);
      this.scoreEl.textContent = this.score;

      // Speed up: handles jumps that cross multiple milestones (e.g. +3 from GoldenApple)
      const milestonesCrossed =
        Math.floor(this.score / 5) - Math.floor(oldScore / 5);
      if (milestonesCrossed > 0 && this.speed > 40 && !this.skipSpeedUp) {
        this.speed = Math.max(40, this.speed - 5 * milestonesCrossed);
      }
      this.skipSpeedUp = false;

      // Secondary effect (speed penalty, skip flag, etc.)
      eaten.effect(this);

      // Add obstacles every 8 points on medium/hard
      if (
        this.difficulty !== "easy" &&
        this.score > 0 &&
        this.score % 8 === 0
      ) {
        this.obstacles.addRandom((x, y) => this.isOccupied(x, y, false));
      }

      // Respawn apple immediately if it was eaten
      if (eaten.type === "apple") {
        this.fruits.push(
          FruitFactory.spawnApple((x, y) => this.isOccupied(x, y, false)),
        );
      }
    } else {
      this.snake.removeTail();
    }

    // Decay special fruit timers — remove any that have expired
    this.fruits = this.fruits.filter((f) => {
      if (f.type === "apple") return true;
      f.ticksLeft--;
      return f.ticksLeft > 0;
    });

    // Periodically try to spawn a new special fruit
    const fc = FRUIT_CONFIG[this.difficulty];
    this.spawnTimer++;
    if (this.spawnTimer >= fc.spawnInterval) {
      this.spawnTimer = 0;
      const specialCount = this.fruits.filter((f) => f.type !== "apple").length;
      if (specialCount < fc.maxSpecial) {
        const lifespan = this.getSpecialLifespan();
        this.fruits.push(
          FruitFactory.spawnSpecial(
            (x, y) => this.isOccupied(x, y, false),
            lifespan,
          ),
        );
      }
    }
  }

  //Draw

  draw() {
    this.renderer.drawBackground();
    this.renderer.drawObstacles(this.obstacles);
    for (const fruit of this.fruits) {
      this.renderer.drawFruit(fruit);
    }
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

    setTimeout(() => {
      if (this.score > 0) this.showNameModal();
      else this.screens.show("over");
    }, 400);
  }

  showNameModal() {
    const modal = document.getElementById("name-modal");
    const nameInput = document.getElementById("modal-name");
    const scoreVal = document.getElementById("modal-score-val");

    scoreVal.textContent = this.score;
    nameInput.value = "";
    modal.classList.remove("hidden");
    nameInput.focus();

    const submit = async () => {
      const name = nameInput.value.trim() || "Anonymous";
      Storage.setPlayerName(name);
      modal.classList.add("hidden");
      await LeaderboardAPI.submitScore(name, this.score, this.difficulty);
      this.screens.show("over");
    };

    document.getElementById("btn-modal-submit").onclick = submit;
    document.getElementById("btn-modal-skip").onclick = () => {
      modal.classList.add("hidden");
      this.screens.show("over");
    };
    nameInput.onkeydown = (e) => {
      if (e.key === "Enter") submit();
    };
  }

  async showLeaderboard(filter = "easy") {
    this.screens.show("leaderboard");

    // Sync active tab to match the filter being loaded
    document.querySelectorAll(".lb-tab").forEach((t) => {
      t.classList.toggle("active", t.dataset.filter === filter);
    });

    const loading = document.getElementById("lb-loading");
    const empty = document.getElementById("lb-empty");
    const list = document.getElementById("lb-list");

    loading.classList.remove("hidden");
    empty.classList.add("hidden");
    list.innerHTML = "";

    const scores = await LeaderboardAPI.getTopScores(filter, 10);

    loading.classList.add("hidden");

    if (scores.length === 0) {
      empty.classList.remove("hidden");
      return;
    }

    scores.forEach((entry, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="lb-rank ${i < 3 ? "lb-rank-top" : ""}">${i + 1}</span>
        <span class="lb-name">${entry.name}</span>
        <span class="lb-score">${entry.score}</span>
        <span class="lb-diff lb-diff--${entry.difficulty}">${entry.difficulty}</span>
      `;
      list.appendChild(li);
    });
  }
}
