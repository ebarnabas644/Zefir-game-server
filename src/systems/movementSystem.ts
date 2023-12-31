import { MovementComponent } from '../entity/Components/movementComponent.js'
import { PositionComponent } from '../entity/Components/positionComponent.js'
import { ISystem } from './Interfaces/ISystem.js'
import * as v from '@thi.ng/vectors'
import { TYPES } from '../inversify.types.js'
import { IGameState } from '../gameState/IGameState.js'
import { injectable, inject } from 'inversify'

@injectable()
export class MovementSystem implements ISystem {
        private state: IGameState

        constructor(@inject(TYPES.IGameState) state: IGameState) {
                this.state = state
        }
        start(): void {
                throw new Error('Method not implemented.')
        }
        update(): void {
                const movementComponents = this.state
                        .getEntities()
                        .map((x) => x.getComponent('movement') as MovementComponent)
                        .filter((x) => x !== undefined)
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
