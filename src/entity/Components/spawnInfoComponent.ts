import { Vec2 } from '@thi.ng/vectors/vec2'
import { Component } from './component.js'

export class SpawnInfoComponent extends Component {
        spawnPosition: Vec2
        constructor(x: number, y: number) {
                super()
                this.spawnPosition = new Vec2([x, y])
        }
}
