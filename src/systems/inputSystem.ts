import { injectable, inject } from 'inversify'
import { Action, ActionQueueComponent } from '../entity/Components/actionQueueComponent.js'
import { IGameState } from '../gameState/IGameState.js'
import { TYPES } from '../inversify.types.js'

export type InputEvent = {
        input: string
        data: { [key: string]: unknown }
}

@injectable()
export class InputSystem {
        private state: IGameState
        constructor(@inject(TYPES.IGameState) state: IGameState) {
                this.state = state
        }

        public setInputs(inputs: InputEvent[], socketId: string) {
                const player = this.state.findPlayer(socketId)
                if (!player) return
                const actionQueueComponent = player.getComponent('actionQueue') as ActionQueueComponent
                if (!actionQueueComponent) return
                const actions: Action[] = []
                for (const input of inputs) {
                        if (input.input == 'attack') {
                                const actionToAdd: Action = {
                                        name: input.input,
                                        duration: 10,
                                        data: input.data
                                }
                                actionQueueComponent.addActionToBlockingQueue(actionToAdd)
                        } else {
                                const actionToAdd: Action = {
                                        name: input.input,
                                        duration: -1,
                                        data: input.data
                                }
                                actions.push(actionToAdd)
                        }
                }

                actionQueueComponent.actions = actions
        }
}
