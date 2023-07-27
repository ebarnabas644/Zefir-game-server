import { MovementComponent } from '../entity/Components/movementComponent.js'
import { PositionComponent } from '../entity/Components/positionComponent.js'
import { GameState } from '../gameState.js'
import { ISystem } from './Interfaces/ISystem.js'
import * as v from '@thi.ng/vectors'

export class MovementSystem implements ISystem {
        private state: GameState

        constructor(state: GameState) {
                this.state = state
        }
        start(): void {
                throw new Error('Method not implemented.')
        }
        update(): void {
                const movementComponents = this.state.entities.map((x) => x.getComponent('movement') as MovementComponent)
                movementComponents.forEach((x) => this.calculateMovement(x))
        }

        private calculateMovement(movementComponent: MovementComponent) {
                const entity = movementComponent.entity
                if (!entity) return
                const positionComponent = entity.getComponent('position') as PositionComponent
                if (!positionComponent) return
                const movementVector = movementComponent.movementVector
                v.normalize(null, movementVector, movementComponent.speed)
                v.add(null, positionComponent.position, movementVector)
        }
}
