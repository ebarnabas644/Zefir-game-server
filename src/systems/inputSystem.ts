import { ActionQueueComponent } from '../entity/Components/actionQueueComponent.js'
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
                actionQueueComponent.actions = new Set(inputs)
        }
}
