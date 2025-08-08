import { Application } from "pixi.js";
import { GameScene } from "./gameScene";
export class Game{
    app = new Application
    scene!: GameScene

    constructor(){}

    async init(container: HTMLElement){
        await this.app.init({
            antialias: true,
            resizeTo: container,
            background: 0x2c2c2c
        })
        container.appendChild(this.app.canvas)
    }

    setScene(newScene: GameScene){
        this.scene?.destroy()
        this.scene = newScene
        newScene.create(this)
    }
}