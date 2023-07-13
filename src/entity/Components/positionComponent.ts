import { Component } from './component.js'
import { Vec2 } from '@thi.ng/vectors'

export class PositionComponent extends Component {
  public position: Vec2
  public speed: number
  constructor(public x: number, public y: number) {
    super()
    this.position = new Vec2([x, y])
    this.speed = 0
  }
  }