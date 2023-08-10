import { PositionComponent } from '../entity/Components/positionComponent.js'
import { StrategyComponent } from '../entity/Components/strategyComponent.js'
import { ISystem } from './Interfaces/ISystem.js'
import * as v from '@thi.ng/vectors'
import { TYPES } from '../inversify.types.js'
import { IGameState } from '../gameState/IGameState.js'
import { injectable, inject } from 'inversify'

@injectable()
export class StrategyStateUpdateSystem implements ISystem {
        state: IGameState
        constructor(@inject(TYPES.IGameState) state: IGameState) {
                this.state = state
        }
        start(): void {
                throw new Error('Method not implemented.')
        }
        update(): void {
                const strategyComponents = this.state
                        .getEntities()
                        .map((x) => x.getComponent('strategy') as StrategyComponent)
                        .filter((x) => x !== undefined)
                strategyComponents.forEach((x) => this.calculateStrategyState(x))
        }

        calculateStrategyState(strategyComponent: StrategyComponent) {
                const entity = strategyComponent.entity
                if (!entity) return
                const mobPosition = entity.getComponent('position') as PositionComponent
                if (!mobPosition) return
                const mobTargets = this.state.getEntities().filter((x) => {
                        const tag = x.findTag('targetableByMob')
                        return tag !== undefined && tag == true
                })
                strategyComponent.strategy = 'idle'
                mobTargets.forEach((entity) => {
                        const targetPos = entity.getComponent('position') as PositionComponent
                        if (!targetPos) return
                        const distance = v.dist2(targetPos.position, mobPosition.position)
                        if (distance <= 100) {
                                strategyComponent.strategy = 'combat'
                        }
                })
        }
}
