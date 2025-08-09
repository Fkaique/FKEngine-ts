import { AnimatedSprite, Assets, Container, Texture } from "pixi.js";
import { Game } from "../engine/game";
import { GameObject } from "../engine/gameObject";
import { Bodies, Body, Composite, Constraint, Engine, Events } from "matter-js";
import { createJoystick } from "../util/createJoystick";
import { Key } from "../engine/gameJoystick";
import { DebugBody } from "../util/debugBody";

export enum playerState {
  MOVE,
  HIT,
}

export class Player extends GameObject {
  container = new Container();
  sprPlayerIdle!: AnimatedSprite;
  sprPlayerRun!: AnimatedSprite;
  body!: Body;
  spring!: Constraint;
  joystick = createJoystick();
  currentSprite: AnimatedSprite | null = null;
  canJump = true;
  canSuffer = true;
  suffering = false;
  state = playerState.MOVE;
  static readonly SPEED = 0.15;
  static readonly MAX_SPEED = 0.1;
  static readonly MAX_RUN_ANIMATION_SPRITE = 0.001;
  static readonly JUMP_FORCE = 0.8;

  constructor(readonly physics: Engine) {
    super();
  }

  setSprite(newSprite: AnimatedSprite) {
    if (this.currentSprite === newSprite) {
      return;
    }
    if (this.currentSprite) {
      this.container.replaceChild(this.currentSprite, newSprite);
    } else {
      this.container.addChild(newSprite);
    }
    this.currentSprite = newSprite;
  }

  async preLoad(): Promise<void> {
    await Assets.load([
      "./assets/player/Lilian1.png",
      "./assets/player/Lilian2.png",
      "./assets/player/Lilian3.png",
      "./assets/player/LilianRun1.png",
      "./assets/player/LilianRun2.png",
      "./assets/player/LilianRun3.png",
      "./assets/player/LilianRun4.png",
    ]);
  }
  create(game: Game): void {
    super.create(game);

    const spriteXScale = 2; //
    const spriteYScale = 2; //

    this.sprPlayerIdle = new AnimatedSprite([
      Texture.from("./assets/player/Lilian1.png"),
      Texture.from("./assets/player/Lilian2.png"),
      Texture.from("./assets/player/Lilian3.png"),
    ]);
    this.sprPlayerIdle.play();
    this.sprPlayerIdle.animationSpeed = 0.05; //
    this.sprPlayerIdle.scale.set(spriteXScale, spriteYScale);
    this.sprPlayerIdle.anchor.set(0.5);

    this.sprPlayerRun = new AnimatedSprite([
      Texture.from("./assets/player/LilianRun1.png"),
      Texture.from("./assets/player/LilianRun2.png"),
      Texture.from("./assets/player/LilianRun3.png"),
      Texture.from("./assets/player/LilianRun4.png"),
    ]);
    this.sprPlayerRun.play();
    this.sprPlayerRun.scale.set(spriteXScale, spriteYScale);
    this.sprPlayerRun.anchor.set(0.5);

    this.setSprite(this.sprPlayerIdle);
    game.app.stage.addChild(this.container);

    this.body = Bodies.rectangle(
      100,
      100,
      this.sprPlayerIdle.width,
      this.sprPlayerIdle.height,
      {
        friction: 1,
        frictionAir: 0.01,
        mass: 10,
        density: 10,
        inertia: Infinity,
        label: "player",
      },
    );

    Composite.add(this.physics.world, [this.body]);

    game.scene.addObject(this.joystick);

    this.joystick.onUpdate((key) => {
      if (key !== Key.LEFT && key !== Key.RIGHT) {
        return;
      }
      const hSpeed =
        Number(this.joystick.isKeyDown(Key.RIGHT)) -
        Number(this.joystick.isKeyDown(Key.LEFT));
      console.log(hSpeed);

      if (hSpeed === 0) {
        this.setSprite(this.sprPlayerIdle);
      } else {
        this.setSprite(this.sprPlayerRun);
        this.container.scale.x = Math.sign(hSpeed);
      }
    });
    this.joystick.onKeyDown(Key.JUMP, () => {
      if (!this.canJump) return;
      this.canJump = false;
      this.body.friction = 0;
      Body.applyForce(this.body, this.body.position, {
        y: -Player.JUMP_FORCE,
        x: 0,
      });
    });

    Events.on(this.physics, "collisionStart", (event) => {
      for (const pair of event.pairs) {
        const angle =
          Math.atan2(pair.collision.normal.y, pair.collision.normal.x) *
          (180 / Math.PI);
        if (
          pair.bodyB === this.body &&
          pair.bodyA.label === "ground" &&
          angle == 90
        ) {
          if (this.state === playerState.HIT) {
            this.state = playerState.MOVE;
          }
          this.canJump = true;
          this.body.friction = 1;
          break;
        }
        if (
          pair.bodyA === this.body &&
          pair.bodyB.label === "ground" &&
          angle == -90
        ) {
          this.canJump = true;
          this.body.friction = 1;
          break;
        }
      }
    });

    game.scene.addObject(new DebugBody(this.body));
  }
  update(): void {
    super.update();
    this.sprPlayerRun.animationSpeed = Math.max(
      Math.abs(
        (this.body.velocity.x / Player.SPEED) * Player.MAX_RUN_ANIMATION_SPRITE,
      ),
      0.05,
    );
    if (this.state == playerState.MOVE) {
      const hSpeed =
        (Number(this.joystick.isKeyDown(Key.RIGHT)) -
          Number(this.joystick.isKeyDown(Key.LEFT))) *
        Player.SPEED;

      Body.applyForce(this.body, this.body.position, {
        x: hSpeed,
        y: 0,
      });
      if (Math.abs(this.body.velocity.x) > Player.MAX_SPEED) {
        Body.setVelocity(this.body, {
          x: Math.sign(this.body.velocity.x) * Player.MAX_SPEED,
          y: this.body.velocity.y,
        });
      }
      if (Math.abs(Body.getVelocity(this.body).x) < 0.00001) {
        if (this.currentSprite !== this.sprPlayerIdle) {
          this.setSprite(this.sprPlayerIdle);
        }
      } else {
        if (this.currentSprite !== this.sprPlayerRun) {
          this.setSprite(this.sprPlayerRun);
        }
      }
    } else if (this.state === playerState.HIT) {
      if (this.suffering) {
        Body.applyForce(this.body, this.body.position, {
          x: 0.2 * -Math.sign(this.container.scale.x),
          y: -0.7,
        });
        this.canJump = false;
        this.suffering = false;
      }
    }
    this.container.position.set(this.body.position.x, this.body.position.y);
    this.container.rotation = this.body.angle;
  }
  destroy(): void {
    this.sprPlayerIdle.removeFromParent();
    this.sprPlayerIdle.destroy();
    this.joystick.destroy();
    Composite.remove(this.physics.world, this.body);
  }
}
