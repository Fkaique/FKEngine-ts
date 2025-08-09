import { Game } from "./game";

export class GameObject {
  game!: Game;
  mounted = false;

  create(game: Game) {
    this.game = game;
    this.mounted = true;
  }

  update() {}

  destroy() {}

  async preLoad(): Promise<void> {}
}
