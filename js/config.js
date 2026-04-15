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

// Special fruit spawn config (values are in game ticks)
// spawnInterval: ticks between spawn attempts
// lifespan:      base ticks a special fruit stays alive
// maxSpecial:    max special fruits on screen at once
export const FRUIT_CONFIG = {
  easy: { spawnInterval: 60, lifespan: 80, maxSpecial: 2 },
  medium: { spawnInterval: 45, lifespan: 55, maxSpecial: 2 },
  hard: { spawnInterval: 30, lifespan: 35, maxSpecial: 2 },
};

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyANusrQ8i9sFtEICykboBLIbiur2g0L2Bg",
  authDomain: "snake-leaderboard-1b46d.firebaseapp.com",
  projectId: "snake-leaderboard-1b46d",
  storageBucket: "snake-leaderboard-1b46d.firebasestorage.app",
  messagingSenderId: "370436491421",
  appId: "1:370436491421:web:20fe1e9dfdbd0488c96c74",
};
