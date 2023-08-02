import { ISystem } from './Interfaces/ISystem.js'
import { GameState } from '../gameState.js'
import { Entity } from '../entity/entity.js'
import { PositionComponent } from '../entity/Components/positionComponent.js'
import { SpawnerInfoComponent } from '../entity/Components/spawnerInfoComponent.js'
import { SpriteComponent } from '../entity/Components/spriteComponent.js'
import { HealthComponent } from '../entity/Components/healthComponent.js'
import { StateComponent } from '../entity/Components/stateComponent.js'
import { StrategyComponent } from '../entity/Components/strategyComponent.js'
import { SpawnInfoComponent } from '../entity/Components/spawnInfoComponent.js'
import { Vec2 } from '@thi.ng/vectors/vec2'
import { ActionQueueComponent } from '../entity/Components/actionQueueComponent.js'
import { MovementComponent } from '../entity/Components/movementComponent.js'

export class MonsterSpawnerSystem implements ISystem {
        public state: GameState

        constructor(state: GameState) {
                this.state = state
                this.initSpawners()
                setInterval(() => {
                        for (const spawner of this.state.monsterSpawners) {
                                this.spawnEnemy(spawner)
                        }
                }, 10000)
        }

        start(): void {
                throw new Error('Method not implemented.')
        }
        update(): void {}

        initSpawners() {
                const spawner1 = new Entity('spawner1')
                spawner1.addComponent('position', new PositionComponent(700, 500))
                spawner1.addComponent('spawnerInfo', new SpawnerInfoComponent(200, 200, 5))
                spawner1.addTag('serverOnly', true)
                const spawner2 = new Entity('spawner2')
                spawner2.addComponent('position', new PositionComponent(300, 800))
                spawner2.addComponent('spawnerInfo', new SpawnerInfoComponent(200, 200, 6))
                spawner2.addTag('serverOnly', true)
                this.state.monsterSpawners.push(spawner1)
                this.state.monsterSpawners.push(spawner2)
        }

        spawnEnemy(spawnerEntity: Entity) {
                const spawnerInfo = spawnerEntity.getComponent('spawnerInfo') as SpawnerInfoComponent
                const spawnerPosition = spawnerEntity.getComponent('position') as PositionComponent
                if (!spawnerInfo || !spawnerPosition) return
                if (spawnerInfo.maxNumberOfMobs <= spawnerInfo.mobs.length) return
                const enemy = new Entity('slime')
                const spawnPos = new Vec2([
                        Math.floor(Math.random() * spawnerInfo.area.x) + spawnerPosition.position.x,
                        Math.floor(Math.random() * spawnerInfo.area.y) + spawnerPosition.position.y
                ])
                enemy.addComponent('position', new PositionComponent(spawnPos.x, spawnPos.y))
                enemy.addComponent('sprite', new SpriteComponent('slime.png', true, 'idle'))
                enemy.addComponent('health', new HealthComponent(50))
                enemy.addComponent('state', new StateComponent())
                enemy.addComponent('strategy', new StrategyComponent())
                enemy.addComponent('spawnInfo', new SpawnInfoComponent(spawnPos.x, spawnPos.y))
                enemy.addComponent('actionQueue', new ActionQueueComponent())
                enemy.addComponent('movement', new MovementComponent(2))
                spawnerInfo.mobs.push(enemy)
                this.state.entities.push(enemy)
        }
}
