import { Graphics } from "pixi.js";
import { Game } from "../engine/game";
import { GameObject } from "../engine/gameObject";
import { Bodies, Body, Composite, Engine } from "matter-js";

export class Colision extends GameObject {
  sprite!: Graphics;
  body!: Body;

  constructor(readonly physics: Engine) {
    super();
  }
  create(game: Game): void {
    super.create(game);
    const { width, height } = game.app.canvas;
    this.sprite = new Graphics();
    this.sprite.rect(-width / 2, -50, width, 100);
    this.sprite.fill(0xffffff);
    game.app.stage.addChild(this.sprite);

    this.body = Bodies.rectangle(width / 2, height - 50, width, 100, {
      isStatic: true,
      friction: 0,
      label: "ground",
    });
    Composite.add(this.physics.world, this.body);
  }

  update(): void {
    this.sprite.position.set(this.body.position.x, this.body.position.y);
  }

  destroy(): void {
    this.sprite.removeFromParent();
    this.sprite.destroy();
    Composite.remove(this.physics.world, this.body);
    super.destroy();
  }
}
