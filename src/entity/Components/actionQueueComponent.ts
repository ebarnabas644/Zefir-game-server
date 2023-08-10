import { Component } from './component.js'

export type Action = {
        name: string
        duration: number
        data?: { [key: string]: unknown }
}

export class ActionQueueComponent extends Component {
        public actions: Action[]
        public blockingActions: Action[]

        constructor() {
                super()
                this.actions = []
                this.blockingActions = []
        }

        public hasAction(action: Action): boolean {
                const result = this.actions.find((x) => x.name == action.name)
                return result !== undefined
        }

        public hasActionByName(name: string): boolean {
                const result = this.actions.find((x) => x.name == name)
                return result !== undefined
        }

        public addActionToQueue(actionToAdd: Action) {
                const result = this.actions.find((x) => x.name == actionToAdd.name)
                if (result) return
                this.actions.push(actionToAdd)
        }

        public addActionToBlockingQueue(actionToAdd: Action) {
                const result = this.blockingActions.find((x) => x.name == actionToAdd.name)
                if (result) return
                this.blockingActions.push(actionToAdd)
        }

        public removeBlockingActionByName(actionName: string) {
                const result = this.blockingActions.find((x) => x.name == actionName)
                if (!result) return
                const index = this.actions.indexOf(result)
                if (index == -1) return
                this.blockingActions.splice(index, 1)
        }

        public removeAction(action: Action) {
                const index = this.actions.indexOf(action)
                if (index == -1) return
                this.actions.splice(index, 1)
        }

        public clearQueue() {
                this.actions = []
        }
}
