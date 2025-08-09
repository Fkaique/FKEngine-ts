import { Game } from "../engine/game";
import { GameJoystick, Key, KeyState } from "../engine/gameJoystick";

export class KeyboardJoystick extends GameJoystick {
  keyMapping = new Map<string, Key>([
    ["w", Key.UP],
    ["s", Key.DOWN],
    ["a", Key.LEFT],
    ["d", Key.RIGHT],

    ["arrowup", Key.UP],
    ["arrowdown", Key.DOWN],
    ["arrowleft", Key.LEFT],
    ["arrowright", Key.RIGHT],

    ["enter", Key.CONFIRM],
    ["l", Key.BACK],
    ["k", Key.JUMP],
  ]);

  #onKeyDown = (event: KeyboardEvent) => {
    const key = this.keyMapping.get(event.key.toLowerCase());
    if (typeof key === "undefined") {
      return;
    }

    this.setKeyState(key, KeyState.DOWN);
  };
  #onKeyUp = (event: KeyboardEvent) => {
    const key = this.keyMapping.get(event.key.toLowerCase());
    if (typeof key === "undefined") {
      return;
    }

    this.setKeyState(key, KeyState.UP);
  };

  create(game: Game): void {
    super.create(game);
    window.addEventListener("keydown", this.#onKeyDown);
    window.addEventListener("keyup", this.#onKeyUp);
  }

  destroy(): void {
    window.removeEventListener("keydown", this.#onKeyDown);
    window.removeEventListener("keyup", this.#onKeyUp);
    super.destroy();
  }
}
