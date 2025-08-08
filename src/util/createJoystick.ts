import { GameJoystick } from "../engine/gameJoystick";
import { DualShockJoystick } from "../joysticks/dualShockJoystick";
import { KeyboardJoystick } from "../joysticks/keyboardJoystick";

class DynamicJoystick extends GameJoystick{
    #keyboard = new KeyboardJoystick
    #dualShock = new DualShockJoystick
    #current?: GameJoystick

    update(): void {
        super.update()
        const gamepad = navigator.getGamepads()[0]
        let joystick: GameJoystick

        if (gamepad){
            joystick = this.#dualShock
        }else{
            joystick = this.#keyboard
        }

        if (joystick!==this.#current){
            this.#current?.destroy()
            joystick.create(this.game)
            this.#current = joystick
            this.#current.onUpdate((key, state)=>this.setKeyState(key,state))
        }
        this.#current.update()
    }

    destroy(): void {
        this.#current?.destroy()
        super.destroy()
    }
}

export function createJoystick(): GameJoystick{
    return new DynamicJoystick
}