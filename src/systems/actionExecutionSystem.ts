import { ActionQueueComponent } from '../entity/Components/actionQueueComponent.js'
import { MovementComponent } from '../entity/Components/movementComponent.js'
import { StateComponent } from '../entity/Components/stateComponent.js'
import { GameState } from '../gameState.js'
import { ISystem } from './Interfaces/ISystem.js'
import { Vec2 } from '@thi.ng/vectors'

export class ActionExecutionSystem implements ISystem {
        private state: GameState
        private inputAxis: Vec2

        constructor(state: GameState) {
                this.state = state
                this.inputAxis = new Vec2([0, 0])
        }

        start(): void {
                throw new Error('Method not implemented.')
        }

        update(): void {
                const actionQueues = this.state.entities.map((x) => x.getComponent('actionQueue') as ActionQueueComponent)
                actionQueues.forEach((x) => this.executeActions(x))
        }

        private executeActions(actionQueue: ActionQueueComponent) {
                const entity = actionQueue.entity
                if (!entity) return
                const movementComponent = entity.getComponent('movement') as MovementComponent
                const stateComponent = entity.getComponent('state') as StateComponent
                if (!movementComponent || !stateComponent) return
                stateComponent.state = 'idle'
                for (const command of actionQueue.actions) {
                        if (command == 'leftMoveCommand') {
                                this.inputAxis.x = -7
                                stateComponent.state = 'movement'
                        } else if (command == 'rightMoveCommand') {
                                this.inputAxis.x = 7
                                stateComponent.state = 'movement'
                        } else if (command == 'upMoveCommand') {
                                this.inputAxis.y = -7
                                stateComponent.state = 'movement'
                        } else if (command == 'downMoveCommand') {
                                this.inputAxis.y = 7
                                stateComponent.state = 'movement'
                        }
                }

                movementComponent.setMovementVector(this.inputAxis.x, this.inputAxis.y)
                this.inputAxis.x = 0
                this.inputAxis.y = 0
        }
}
