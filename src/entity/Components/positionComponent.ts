import { Component } from './component'

type Vec2 = {
  x: number,
  y: number
}
import { Component } from './component.js'

export class PositionComponent extends Component {
  public position: Vec2
  public speed: number
  constructor(public x: number, public y: number) {
    super()
    this.position = {x, y}
    this.speed = 0
  }
  }