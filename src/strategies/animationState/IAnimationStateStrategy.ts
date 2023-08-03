import { Entity } from '../../entity/entity.js'

export interface IAnimationStateStrategy {
        calculateState(entity: Entity): string
        isCompatible(state: string): boolean
}
