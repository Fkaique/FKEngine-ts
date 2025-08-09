import { Assets, Sprite } from "pixi.js";
import { GameObject } from "../engine/gameObject";
import { Game } from "../engine/game";
import { Bodies, Body, Composite, Engine } from "matter-js";
import { DebugBody } from "../util/debugBody";

export class Thorn extends GameObject {
  sprite!: Sprite;
  body!: Body;

  constructor(readonly physics: Engine) {
    super();
  }

  async preLoad(): Promise<void> {
    await Assets.load(["/assets/thorn.png"]);
  }

  create(game: Game): void {
    super.create(game);

    this.sprite = new Sprite(Assets.get("/assets/thorn.png"));
    this.sprite.anchor.set(0.5);
    game.app.stage.addChild(this.sprite);

    this.body = Bodies.rectangle(
      game.app.canvas.width / 3,
      game.app.canvas.height - 115,
      this.sprite.width,
      this.sprite.height,
      {
        isStatic: true,
        friction: 0,
        label: "ground",
      },
    );
    Composite.add(this.physics.world, this.body);

    game.scene.addObject(new DebugBody(this.body));
  }

  update(): void {
    super.update();
    this.sprite.position.set(this.body.position.x, this.body.position.y);
  }

  destroy(): void {
    this.sprite.destroy();
    Composite.remove(this.physics.world, this.body);
  }
}
