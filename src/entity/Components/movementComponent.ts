import { IScript } from '../Interfaces/IScript.js'
import { Component } from './component.js'
import { Vec2 } from '@thi.ng/vectors'
import { PositionComponent } from './positionComponent.js'
import * as v from "@thi.ng/vectors";

export class MovementComponent extends Component implements IScript{
    public movementVector: Vec2
    private speed: number
    private positionComponent?: PositionComponent

    constructor(){
        super()
        this.speed = 7
        this.movementVector = new Vec2([0,0])
    }

    setMovementVector(x: number, y: number){
        this.movementVector.x += x
        this.movementVector.y += y
        v.normalize(null, this.movementVector, this.speed)
    }

    stopMovement(){
        this.movementVector.x = 0
        this.movementVector.y = 0
    }

    public start(): void {
        this.positionComponent = this.entity?.getComponent('position') as PositionComponent
    }

    public update(): void {
        if(this.positionComponent){
            v.add(null, this.positionComponent.position, this.movementVector)
        }
    }
}