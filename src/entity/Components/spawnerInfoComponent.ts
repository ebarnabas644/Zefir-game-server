import { Vec2 } from '@thi.ng/vectors'
import { Entity } from '../entity.js'
import { Component } from './component.js'

export class SpawnerInfoComponent extends Component {
        public area: Vec2
        public maxNumberOfMobs: number
        public mobs: Entity[]
        constructor(areaXSize: number, areaYSize: number, maxNumberOfMobs: number) {
                super()
                this.area = new Vec2([areaXSize, areaYSize])
                this.maxNumberOfMobs = maxNumberOfMobs
                this.mobs = []
        }
}
