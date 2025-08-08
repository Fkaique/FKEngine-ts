import { GameJoystick, Key, KeyState } from "../engine/gameJoystick";

export class DualShockJoystick extends GameJoystick{
    keyMapping = new Map<number, Key>([
        [12,Key.UP],
        [13,Key.DOWN],
        [14,Key.LEFT],
        [15,Key.RIGHT],
        [9,Key.CONFIRM],
        [1,Key.BACK],
        [0,Key.JUMP],
    ])

    update(): void {
        super.update()
        const gamepad = navigator.getGamepads()[0]
        if (!gamepad){return}

        for (const [index, key] of this.keyMapping.entries()){
            if (gamepad.buttons[index].pressed){
                this.setKeyState(key, KeyState.DOWN)
            }else{
                this.setKeyState(key, KeyState.UP)
            }
        }
    }
}