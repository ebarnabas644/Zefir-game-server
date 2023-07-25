import { IScript } from '../Interfaces/IScript.js'
import { Component } from './component.js'

export type State<T> = {
  name: string,
  requirement: (...params: any[]) => boolean,
  params: T[]
}

export class SpriteComponent extends Component implements IScript {
  private states: State<any>[]
  constructor(public spritePath: string, public animated: boolean = false, public state: string = "default"){
    super()
    this.states = []
  }

  public addState(state: State<any>){
    this.states.push(state)
  }

  public start(): void {
        
  }

  public update(){
    for (const state of this.states) {
      const isRequirementMet = state.requirement(...state.params)
      if(isRequirementMet){
        this.state = state.name
        break
      }
    }
  }
}