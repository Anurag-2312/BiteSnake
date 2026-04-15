# BiteSnake

A classic Snake game built with vanilla JavaScript and HTML5 Canvas, featuring multiple difficulty levels, special fruits, obstacles, and a Firebase-powered online leaderboard.

## Features

- **Three Difficulty Levels** — Easy, Medium, and Hard with varying speed and obstacle counts
- **Special Fruits** — Golden Apple (bonus points, no speed-up), Cherry (2x points), Poison Fruit (slows you down, -1 score)
- **Obstacles** — Randomly placed obstacles on Medium and Hard difficulties
- **Particle Effects** — Visual particle effects on fruit collection
- **Online Leaderboard** — Submit and view top scores per difficulty via Firebase Firestore
- **Mobile Support** — Swipe controls for touch devices
- **Local High Scores** — Best scores saved in localStorage per difficulty

## Controls

| Input | Action |
|-------|--------|
| Arrow Keys / WASD | Move the snake |
| Swipe (mobile) | Move the snake |

## Project Structure

```
snake_game_web/
├── index.html                  # Main HTML
├── css/style.css               # Styling & UI
├── js/
│   ├── main.js                 # Entry point
│   ├── config.js               # Game constants & Firebase config
│   ├── engine/
│   │   ├── Game.js             # Core game loop & logic
│   │   └── InputHandler.js     # Keyboard & touch input
│   ├── entities/
│   │   ├── Snake.js            # Snake entity
│   │   ├── Fruit.js            # Base fruit class
│   │   ├── FruitTypes.js       # Apple, Golden, Poison, Cherry
│   │   └── Obstacle.js         # Obstacle manager
│   ├── rendering/
│   │   ├── Renderer.js         # Canvas rendering
│   │   └── ParticleSystem.js   # Particle effects
│   ├── screens/
│   │   └── ScreenManager.js    # Screen transitions
│   ├── network/
│   │   └── LeaderboardAPI.js   # Firebase leaderboard API
│   └── utils/
│       └── Storage.js          # localStorage wrapper
└── README.md
```

## Tech Stack

- Vanilla JavaScript (ES Modules)
- HTML5 Canvas
- CSS3
- Firebase Firestore (leaderboard)

## Running Locally

No build step required. Serve the project with any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using VS Code
# Install "Live Server" extension and click "Go Live"
```

Then open `http://localhost:8000` in your browser.

## Deployment

This is a static site. Connect the GitHub repo to [Vercel](https://vercel.com) and deploy with default settings.
