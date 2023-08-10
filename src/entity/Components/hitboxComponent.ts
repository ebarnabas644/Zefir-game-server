import { Vec2 } from '@thi.ng/vectors'
import { Component } from './component.js'

export class HitboxComponent extends Component {
        public size: Vec2

        constructor(xSize: number, ySize: number) {
                super()
                this.size = new Vec2([xSize, ySize])
        }
}
