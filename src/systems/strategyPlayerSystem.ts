import { Vec2 } from '@thi.ng/vectors'
import { SpawnInfoComponent } from '../entity/Components/spawnInfoComponent.js'
import { StrategyComponent } from '../entity/Components/strategyComponent.js'
import { GameState } from '../gameState.js'
import { ISystem } from './Interfaces/ISystem.js'
import { Action } from '../entity/Components/actionQueueComponent.js'

export class StrategyPlayerSystem implements ISystem {
        state: GameState
        constructor(state: GameState) {
                this.state = state
        }

        start(): void {
                throw new Error('Method not implemented.')
        }
        update(): void {
                const strategyComponents = this.state.entities
                        .map((x) => x.getComponent('strategy') as StrategyComponent)
                        .filter((x) => x !== undefined)
                strategyComponents.forEach((x) => this.playStrategy(x))
        }

        playStrategy(strategyComponent: StrategyComponent) {
                const entity = strategyComponent.entity
                if (!entity) return
                if (strategyComponent.strategy == 'idle') {
                        const spawnInfo = entity.getComponent('spawnInfo') as SpawnInfoComponent
                        if (!spawnInfo) return
                        const randomPos = new Vec2([
                                this.randomNumberInRange(spawnInfo.spawnPosition.x - 50, spawnInfo.spawnPosition.x + 50),
                                this.randomNumberInRange(spawnInfo.spawnPosition.y - 50, spawnInfo.spawnPosition.y + 50)
                        ])
                        const goToRandomCoordAction: Action = {
                                name: 'goToTarget',
                                data: {
                                        xPos: randomPos.x,
                                        yPos: randomPos.y
                                }
                        }
                }
        }

        randomNumberInRange(min: number, max: number) {
                return Math.random() * (max - min) + min
        }
}
