export class Storage {
  static getHighScore() {
    return parseInt(localStorage.getItem("snake_high") || "0");
  }

  static setHighScore(score) {
    localStorage.setItem("snake_high", score.toString());
  }

  static getPlayerName() {
    return localStorage.getItem("snake_player_name") || "";
  }

  static setPlayerName(name) {
    localStorage.setItem("snake_player_name", name);
  }
}
