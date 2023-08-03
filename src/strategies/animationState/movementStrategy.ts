import { Entity } from '../../entity/entity.js'
import { IAnimationStateStrategy } from './IAnimationStateStrategy.js'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class MovementStrategy implements IAnimationStateStrategy {
        calculateState(entity: Entity): string {
                throw new Error('Method not implemented.')
        }
        isCompatible(state: string): boolean {
                return state == 'movement'
        }
}
