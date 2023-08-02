import { Component } from './component.js'
import { Vec2 } from '@thi.ng/vectors'
import * as v from '@thi.ng/vectors'

export class MovementComponent extends Component {
        public movementVector: Vec2
        public speed: number

        constructor(speed: number) {
                super()
                this.speed = speed
                this.movementVector = new Vec2([0, 0])
        }

        setMovementVector(x: number, y: number) {
                this.movementVector.x = x
                this.movementVector.y = y
                v.normalize(null, this.movementVector, this.speed)
        }

        stopMovement() {
                this.movementVector.x = 0
                this.movementVector.y = 0
        }
}
