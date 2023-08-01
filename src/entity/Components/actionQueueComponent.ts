import { Component } from './component.js'

export type Action = {
        name: string
        data?: { [key: string]: unknown }
}

export class ActionQueueComponent extends Component {
        public actions: Action[]

        constructor() {
                super()
                this.actions = []
        }

        public hasAction(action: Action): boolean {
                const result = this.actions.find((x) => x.name == action.name)
                return result !== undefined
        }

        public addActionToQueue(actionToAdd: Action) {
                let exists = false
                for (const action of this.actions) {
                        if (action.name == actionToAdd.name) {
                                exists = true
                                break
                        }
                }
                if (exists) return
                this.actions.push(actionToAdd)
        }
}
