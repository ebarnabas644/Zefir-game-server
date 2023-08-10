import { Entity } from '../../entity/entity.js'
import { TYPES } from '../../inversify.types.js'
import { IAnimationStateStrategy } from './IAnimationStateStrategy.js'
import { provide } from 'inversify-binding-decorators'

@provide(TYPES.IAnimationStateStrategy)
export class IdleAnimationStrategy implements IAnimationStateStrategy {
        calculateState(entity: Entity): string {
                return 'idle'
        }

        isCompatible(state: string): boolean {
                return state == 'idle'
        }
}
