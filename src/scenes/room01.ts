import { Bodies, Composite } from "matter-js";
import { Game } from "../engine/game";
import { GameScene } from "../engine/gameScene";
import { Colision } from "../objects/colision";
import { Player } from "../objects/player";
import { DebugBody } from "../util/debugBody";

export class Room1 extends GameScene{
    player = new Player()
    colision = new Colision()
    gravity = 0.001
    setup(game: Game): void {
        this.addObject(this.player)
        this.addObject(this.colision)
        const box = Bodies.rectangle(game.app.canvas.width/2,game.app.canvas.height-150,100,100,{
            isStatic: true
        })
        game.physics.gravity.scale = this.gravity

        Composite.add(game.physics.world, box)

        this.addObject(new DebugBody(box))

    }
    update(): void {
        super.update()
    }
    destroy(): void {
        this.player.destroy()
        this.colision.destroy()
        super.destroy()
    }
}