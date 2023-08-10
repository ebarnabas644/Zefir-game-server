import { Vec2 } from '@thi.ng/vectors'
import { SpawnInfoComponent } from '../entity/Components/spawnInfoComponent.js'
import { StrategyComponent } from '../entity/Components/strategyComponent.js'
import { ISystem } from './Interfaces/ISystem.js'
import { Action, ActionQueueComponent } from '../entity/Components/actionQueueComponent.js'
import { TYPES } from '../inversify.types.js'
import { IGameState } from '../gameState/IGameState.js'
import { injectable, inject } from 'inversify'

@injectable()
export class StrategyPlayerSystem implements ISystem {
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
                strategyComponents.forEach((x) => this.playStrategy(x))
        }

        playStrategy(strategyComponent: StrategyComponent) {
                const entity = strategyComponent.entity
                if (!entity) return
                const actionQueue = entity.getComponent('actionQueue') as ActionQueueComponent
                if (!actionQueue) return
                // Idle strategy, TODO: strategy collection
                if (strategyComponent.strategy == 'idle') {
                        if (actionQueue.hasActionByName('goToTarget')) return
                        const spawnInfo = entity.getComponent('spawnInfo') as SpawnInfoComponent
                        if (!spawnInfo) return
                        const randomPos = new Vec2([
                                this.randomNumberInRange(spawnInfo.spawnPosition.x - 100, spawnInfo.spawnPosition.x + 100),
                                this.randomNumberInRange(spawnInfo.spawnPosition.y - 100, spawnInfo.spawnPosition.y + 100)
                        ])
                        const goToRandomCoordAction: Action = {
                                name: 'goToTarget',
                                duration: -1,
                                data: {
                                        xPos: randomPos.x,
                                        yPos: randomPos.y
                                }
                        }

                        actionQueue.addActionToQueue(goToRandomCoordAction)
                }
        }

        randomNumberInRange(min: number, max: number) {
                return Math.random() * (max - min) + min
        }
}
