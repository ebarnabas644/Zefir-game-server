import { provide } from 'inversify-binding-decorators'
import { Entity } from '../../entity/entity.js'
import { IAnimationStateStrategy } from './IAnimationStateStrategy.js'
import { TYPES } from '../../inversify.types.js'

@provide(TYPES.IAnimationStateStrategy)
export class AttackAnimationStrategy implements IAnimationStateStrategy {
        calculateState(entity: Entity): string {
                return 'meleeRight'
        }
        isCompatible(state: string): boolean {
                return state == 'attack'
        }
}
