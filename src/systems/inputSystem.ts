import { Action, ActionQueueComponent } from '../entity/Components/actionQueueComponent.js'
import { GameState } from '../gameState.js'

export class InputSystem {
        private state: GameState
        constructor(state: GameState) {
                this.state = state
        }

        public setInputs(inputs: string[], socketId: string) {
                const player = this.state.findPlayer(socketId)
                if (!player) return
                const actionQueueComponent = player.getComponent('actionQueue') as ActionQueueComponent
                if (!actionQueueComponent) return
                const actions: Action[] = []
                for (const input of inputs) {
                        const actionToAdd: Action = {
                                name: input
                        }
                        let exists = false
                        for (const action of actions) {
                                if (actionToAdd.name == action.name) {
                                        exists = true
                                        break
                                }
                        }

                        if (exists) continue
                        actions.push(actionToAdd)
                }

                actionQueueComponent.actions = actions
        }
}
