import { Graphics } from "pixi.js";
import { Body } from "matter-js";
import { GameObject } from "../engine/gameObject";
import { Game } from "../engine/game";

export class DebugBody extends GameObject {
  graphics = new Graphics();

  constructor(readonly body: Body) {
    super();
  }

  create(game: Game): void {
    super.create(game);
    if (import.meta.env.DEV) {
      game.app.stage.addChild(this.graphics);
    }
  }

  update(): void {
    super.update();
    if (import.meta.env.DEV) {
      this.graphics.clear();
      this.graphics.poly(this.body.vertices);
      this.graphics.stroke({
        width: 2,
        color: 0x00ff00,
      });
    }
  }

  destroy(): void {
    if (import.meta.env.DEV) {
      this.graphics.removeFromParent();
    }
    super.destroy();
  }
}
