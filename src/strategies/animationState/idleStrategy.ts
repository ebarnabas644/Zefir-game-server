import { Entity } from '../../entity/entity.js'
import { IAnimationStateStrategy } from './IAnimationStateStrategy.js'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class IdleStrategy implements IAnimationStateStrategy {
        calculateState(entity: Entity): string {
                return 'test'
        }

        isCompatible(state: string): boolean {
                return state == 'idle'
        }
}
