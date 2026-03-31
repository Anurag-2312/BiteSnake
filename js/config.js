//Game Constants
export const CELL_SIZE = 20;
export const COLS = 30;
export const ROWS = 30;
export const CANVAS_W = COLS * CELL_SIZE;
export const CANVAS_H = ROWS * CELL_SIZE;

//Difficulty Presets
export const DIFFICULTY = {
  easy: { speed: 240, obstacleCount: 0, label: "Easy" },
  medium: { speed: 120, obstacleCount: 12, label: "Medium" },
  hard: { speed: 90, obstacleCount: 25, label: "Hard" },
};
