import { Component } from './component.js'

export type RequirementCallback = (...params: unknown[]) => boolean

export type State<T> = {
        name: string
        requirement: RequirementCallback
        params: T[]
}

export class SpriteComponent extends Component {
        private states: State<unknown>[]
        constructor(
                public spritePath: string,
                public animated: boolean = false,
                public state: string = 'default'
        ) {
                super()
                this.states = []
        }

        public addState(state: State<unknown>) {
                this.states.push(state)
        }

        public start(): void {}

        public update() {
                for (const state of this.states) {
                        const isRequirementMet = state.requirement(...state.params)
                        if (isRequirementMet) {
                                this.state = state.name
                                break
                        }
                }
        }
}
