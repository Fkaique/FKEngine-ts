import { Bodies, Composite, Engine } from "matter-js";
import { Game } from "../engine/game";
import { GameScene } from "../engine/gameScene";
import { Colision } from "../objects/colision";
import { Player } from "../objects/player";
import { DebugBody } from "../util/debugBody";
import { Thorn } from "../objects/thorn";

export class Room1 extends GameScene{
    physics = Engine.create({
        gravity: {
            x: 0,
            y: 2
        }
    })
    player = new Player(this.physics)
    colision = new Colision(this.physics)
    thorn = new Thorn(this.physics)
    gravity = 0.001
    setup(game: Game): void {
        this.addObject(this.player)
        this.addObject(this.colision)
        this.addObject(this.thorn)
        const box = Bodies.rectangle(game.app.canvas.width/2,game.app.canvas.height-125,100,50,{
            isStatic: true,
            label: 'ground'

        })
        const box1 = Bodies.rectangle(game.app.canvas.width/2,game.app.canvas.height-350,100,50,{
            isStatic: true,
            label: 'ground'
        })
        this.physics.gravity.scale = this.gravity

        Composite.add(this.physics.world, [box, box1])

        this.addObject(new DebugBody(box))
        this.addObject(new DebugBody(box1))
        
    }
    update(): void {
        super.update()
        Engine.update(this.physics)
    }
    destroy(): void {
        this.player.destroy()
        this.colision.destroy()
        this.thorn.destroy()
        super.destroy()
    }
}