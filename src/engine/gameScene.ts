import { Game } from "./game";
import { GameObject } from "./gameObject";

export abstract class GameScene extends GameObject {
  objects: GameObject[] = [];
  #update = () => this.update?.();

  create(game: Game): void {
    super.create(game);
    this.setup?.(game);
    this.game.app.ticker.add(this.#update);
  }

  addObject(obj: GameObject) {
    this.objects.push(obj);
    if (this.game) {
      obj.preLoad().then(() => {
        obj.create(this.game);
      });
    }
  }

  removeObject(obj: GameObject) {
    this.objects = this.objects.filter((item) => item !== obj);
    if (this.game) {
      obj.destroy();
    }
  }

  destroy(): void {
    this.game.app.ticker.remove(this.#update);
    for (const obj of this.objects) {
      obj.destroy();
    }
    this.objects = [];
    super.destroy();
  }

  async preLoad(): Promise<void> {
    for (const obj of this.objects) {
      obj.preLoad();
    }
  }

  setup(_game: Game) {}

  update(): void {
    for (const obj of this.objects) {
      if (obj.mounted) {
        obj.update();
      }
    }
  }
}
