import { GameObject } from "./gameObject";

export enum Key {
  UP,
  DOWN,
  LEFT,
  RIGHT,

  CONFIRM,
  BACK,

  JUMP,
}

export enum KeyState {
  DOWN,
  UP,
}

export abstract class GameJoystick extends GameObject {
  #keys = new Map<Key, KeyState>([
    [Key.UP, KeyState.UP],
    [Key.DOWN, KeyState.UP],
    [Key.LEFT, KeyState.UP],
    [Key.RIGHT, KeyState.UP],
    [Key.CONFIRM, KeyState.UP],
    [Key.BACK, KeyState.UP],
    [Key.JUMP, KeyState.UP],
  ]);
  #listeners = new Set<(key: Key, state: KeyState) => unknown>();

  isKeyDown(key: Key) {
    return this.#keys.get(key) == KeyState.DOWN;
  }

  isKeyUP(key: Key) {
    return this.#keys.get(key) == KeyState.UP;
  }

  protected setKeyState(key: Key, state: KeyState) {
    const currentState = this.#keys.get(key);
    if (currentState === state) {
      return;
    }
    this.#keys.set(key, state);
    for (const listener of this.#listeners) {
      listener(key, state);
    }
  }

  onUpdate(callback: (key: Key, state: KeyState) => unknown) {
    this.#listeners.add(callback);
    return () => {
      this.#listeners.delete(callback);
    };
  }

  offUpdate(callback: (key: Key, state: KeyState) => unknown) {
    this.#listeners.delete(callback);
    return this;
  }

  onKeyUpdate(key: Key, callback: (state: KeyState) => unknown) {
    return this.onUpdate((k, state) => k === key && callback(state));
  }

  onKeyUp(key: Key, callback: () => unknown) {
    return this.onKeyUpdate(
      key,
      (state) => state === KeyState.UP && callback(),
    );
  }

  onKeyDown(key: Key, callback: () => unknown) {
    return this.onKeyUpdate(
      key,
      (state) => state === KeyState.DOWN && callback(),
    );
  }

  destroy(): void {
    this.#listeners.clear();
    super.destroy();
  }
}
