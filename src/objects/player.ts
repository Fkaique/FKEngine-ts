import { AnimatedSprite, Assets, Container, Texture } from "pixi.js";
import { Game } from "../engine/game";
import { GameObject } from "../engine/gameObject";
import { Bodies, Body, Composite, Constraint } from "matter-js";
import { createJoystick } from "../util/createJoystick";
import { Key, KeyState } from "../engine/gameJoystick";
import { DebugBody } from "../util/debugBody";

export class Player extends GameObject{
    container = new Container() 
    sprPlayerIdle!: AnimatedSprite
    sprPlayerRun!: AnimatedSprite
    body!: Body
    spring!: Constraint
    joystick = createJoystick()
    currentSprite: AnimatedSprite | null = null
    isJumping = false
    static readonly SPEED = 3
    static readonly MAX_RUN_ANIMATION_SPRITE = 0.001
    static readonly JUMP_FORCE = 15

    setSprite(newSprite: AnimatedSprite){
        if (this.currentSprite===newSprite){return}
        if (this.currentSprite){
            this.container.replaceChild(this.currentSprite, newSprite)
        }else{
            this.container.addChild(newSprite)
        }
        this.currentSprite = newSprite
        
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
        ])
    }
    create(game: Game): void {
        super.create(game)

        const spriteXScale = 2 //
        const spriteYScale = 2 //

        this.sprPlayerIdle = new AnimatedSprite([
            Texture.from("./assets/player/Lilian1.png"),
            Texture.from("./assets/player/Lilian2.png"),
            Texture.from("./assets/player/Lilian3.png")
        ])
        this.sprPlayerIdle.play()
        this.sprPlayerIdle.animationSpeed = 0.05 //
        this.sprPlayerIdle.scale.set(spriteXScale,spriteYScale)
        this.sprPlayerIdle.anchor.set(0.5)

        this.sprPlayerRun = new AnimatedSprite([
            Texture.from("./assets/player/LilianRun1.png"),
            Texture.from("./assets/player/LilianRun2.png"),
            Texture.from("./assets/player/LilianRun3.png"),
            Texture.from("./assets/player/LilianRun4.png")
        ])
        this.sprPlayerRun.play()
        this.sprPlayerRun.scale.set(spriteXScale,spriteYScale)
        this.sprPlayerRun.anchor.set(0.5)

        this.setSprite(this.sprPlayerIdle)
        game.app.stage.addChild(this.container)

        this.body = Bodies.rectangle(
            100, 100,
            this.sprPlayerIdle.width, 
            this.sprPlayerIdle.height,
            {
                friction: 0,
                frictionAir: 0,
                inertia: Infinity
            }
        )
        

        Composite.add(game.physics.world, [this.body])

        game.scene.addObject(this.joystick)

        this.joystick.onUpdate((key)=>{
            if (key!== Key.LEFT && key!==Key.RIGHT){return}
            const hSpeed = (Number(this.joystick.isKeyDown(Key.RIGHT))-Number(this.joystick.isKeyDown(Key.LEFT)))*Player.SPEED
            if (hSpeed===0){
                this.setSprite(this.sprPlayerIdle)
            }else{
                this.setSprite(this.sprPlayerRun)
            }
            if (hSpeed===0){
                Body.setVelocity(this.body, {
                    x: 0,
                    y: this.body.velocity.y
                })
            }else{
                Body.setVelocity(this.body,{
                    y: this.body.velocity.y,
                    x: hSpeed
                })
                console.log(hSpeed);
                
                
                this.container.scale._x = Math.sign(hSpeed)
            }
        })

        this.joystick.onKeyUpdate(Key.JUMP, (state) =>{
            const vSpeed = (Number(this.joystick.isKeyDown(Key.JUMP))*-Player.JUMP_FORCE)
            Body.setVelocity(this.body,{
                y: vSpeed,
                x: this.body.velocity.x
            })
            
            console.log(vSpeed);

        })
        game.scene.addObject(new DebugBody(this.body))

    }
    update(): void {
        this.sprPlayerRun.animationSpeed = Math.max(Math.abs(this.body.velocity.x/Player.SPEED*Player.MAX_RUN_ANIMATION_SPRITE),0.05)
        if (Math.abs(Body.getVelocity(this.body).x) < 1 && this.currentSprite!==this.sprPlayerIdle){
            console.log("idle", Math.abs(Body.getVelocity(this.body).x));
            this.setSprite(this.sprPlayerIdle)
        }


        // Body.setAngularSpeed(this.body,0)
        this.container.position.set(this.body.position.x,this.body.position.y)
        this.container.rotation = this.body.angle


    }
    destroy(): void {
        this.sprPlayerIdle.removeFromParent()
        this.sprPlayerIdle.destroy()
        Composite.remove(this.game.physics.world,this.body)

    }
}