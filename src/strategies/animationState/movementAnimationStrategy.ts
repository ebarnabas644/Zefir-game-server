import { provide } from 'inversify-binding-decorators'
import { MovementComponent } from '../../entity/Components/movementComponent.js'
import { Entity } from '../../entity/entity.js'
import { IAnimationStateStrategy } from './IAnimationStateStrategy.js'
import { TYPES } from '../../inversify.types.js'

@provide(TYPES.IAnimationStateStrategy)
export class MovementAnimationStrategy implements IAnimationStateStrategy {
        calculateState(entity: Entity): string {
                const movementComponent = entity.getComponent('movement') as MovementComponent
                if (!movementComponent) return 'default'
                const movementVector = movementComponent.movementVector
                if (movementVector.x > 0) {
                        return 'runRight'
                } else if (movementVector.x < 0) {
                        return 'runLeft'
                } else if (movementVector.y > 0) {
                        return 'runDown'
                } else if (movementVector.y < 0) {
                        return 'runUp'
                }
                return 'default'
        }
        isCompatible(state: string): boolean {
                return state == 'movement'
        }
}
