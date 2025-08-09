import { Bodies, Composite, Engine, Events } from "matter-js";
import { Game } from "../engine/game";
import { GameScene } from "../engine/gameScene";
import { Colision } from "../objects/colision";
import { Player, playerState } from "../objects/player";
import { DebugBody } from "../util/debugBody";
import { Thorn } from "../objects/thorn";
import { Graphics } from "pixi.js";

export class Room1 extends GameScene {
  physics = Engine.create({
    gravity: {
      x: 0,
      y: 2,
      scale: 0.003,
    },
  });
  player = new Player(this.physics);
  colision = new Colision(this.physics);
  thorn = new Thorn(this.physics);
  setup(game: Game): void {
    this.addObject(this.player);
    this.addObject(this.colision);
    this.addObject(this.thorn);
    const box = Bodies.rectangle(
      game.app.canvas.width / 2,
      game.app.canvas.height - 125,
      100,
      50,
      {
        isStatic: true,
        label: "ground",
      },
    );
    const box1 = Bodies.rectangle(
      game.app.canvas.width / 2,
      game.app.canvas.height - 350,
      100,
      50,
      {
        isStatic: true,
        label: "ground",
      },
    );
    const graphics = new Graphics();
    graphics.rect(
      game.app.canvas.width / 2 - 50,
      game.app.canvas.height - 150,
      100,
      50,
    );
    graphics.fill(0xffffff);

    game.app.stage.addChild(graphics);

    graphics.rect(
      game.app.canvas.width / 2 - 50,
      game.app.canvas.height - 375,
      100,
      50,
    );
    graphics.fill(0xffffff);

    Composite.add(this.physics.world, [box, box1]);

    this.addObject(new DebugBody(box));
    this.addObject(new DebugBody(box1));
    Events.on(this.physics, "collisionActive", (event) => {
      event.pairs.forEach((pair) => {
        if (
          (pair.bodyB === this.player.body && pair.bodyA === this.thorn.body) ||
          (pair.bodyA === this.thorn.body && pair.bodyB === this.player.body)
        ) {
          this.player.state = playerState.HIT;
          this.player.suffering = true;
        }
      });
    });
  }
  update(): void {
    super.update();
    Engine.update(this.physics);
  }
  destroy(): void {
    this.player.destroy();
    this.colision.destroy();
    this.thorn.destroy();
    super.destroy();
  }
}
