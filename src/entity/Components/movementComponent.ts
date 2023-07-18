import { IScript } from '../Interfaces/IScript.js'
import { Component } from './component.js'
import { Vec2 } from '@thi.ng/vectors'

export class MovementComponent extends Component implements IScript{
    private movementVector: Vec2

    constructor(){
        super()
        this.movementVector = new Vec2([0,0])
    }

    update(): void {
    }
}