import { ActionQueueComponent } from '../entity/Components/actionQueueComponent.js'
import { MovementComponent } from '../entity/Components/movementComponent.js'
import { PositionComponent } from '../entity/Components/positionComponent.js'
import { StateComponent } from '../entity/Components/stateComponent.js'
import { GameState } from '../gameState.js'
import { ISystem } from './Interfaces/ISystem.js'
import { Vec2 } from '@thi.ng/vectors'
import * as v from '@thi.ng/vectors'

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
                const actionQueues = this.state.entities
                        .map((x) => x.getComponent('actionQueue') as ActionQueueComponent)
                        .filter((x) => x !== undefined)
                actionQueues.forEach((x) => this.executeActions(x))
        }

        private executeActions(actionQueue: ActionQueueComponent) {
                const entity = actionQueue.entity
                if (!entity) return
                const movementComponent = entity.getComponent('movement') as MovementComponent
                const positionComponent = entity.getComponent('position') as PositionComponent
                const stateComponent = entity.getComponent('state') as StateComponent
                if (!movementComponent || !stateComponent || !positionComponent) return
                stateComponent.state = 'idle'
                for (const command of actionQueue.actions) {
                        if (command.name == 'leftMoveCommand') {
                                this.inputAxis.x = -7
                                stateComponent.state = 'movement'
                        } else if (command.name == 'rightMoveCommand') {
                                this.inputAxis.x = 7
                                stateComponent.state = 'movement'
                        } else if (command.name == 'upMoveCommand') {
                                this.inputAxis.y = -7
                                stateComponent.state = 'movement'
                        } else if (command.name == 'downMoveCommand') {
                                this.inputAxis.y = 7
                                stateComponent.state = 'movement'
                        } else if (command.name == 'goToTarget') {
                                const entityPos = positionComponent.position
                                const targetPos = new Vec2([command.data!.xPos as number, command.data!.yPos as number])
                                const distance = v.dist(targetPos, entityPos)
                                if (distance < 10) {
                                        actionQueue.removeAction(command)
                                        continue
                                }
                                v.direction2(this.inputAxis, entityPos, targetPos, 2)
                                stateComponent.state = 'movement'
                        } else if (command.name == 'attack') {
                                const pos = new Vec2([command.data!.xPos as number, command.data!.yPos as number])
                                console.log(`he attac this position: x:${pos.x} y:${pos.y}`)
                                stateComponent.state = 'attack'
                        }
                }

                movementComponent.setMovementVector(this.inputAxis.x, this.inputAxis.y)
                this.inputAxis.x = 0
                this.inputAxis.y = 0
        }
}
