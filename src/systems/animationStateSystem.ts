import { MovementComponent } from '../entity/Components/movementComponent.js'
import { SpriteComponent } from '../entity/Components/spriteComponent.js'
import { StateComponent } from '../entity/Components/stateComponent.js'
import { GameState } from '../gameState.js'
import { ISystem } from './Interfaces/ISystem.js'

export class AnimationStateSystem implements ISystem {
        private state: GameState

        constructor(state: GameState) {
                this.state = state
        }

        start(): void {
                throw new Error('Method not implemented.')
        }
        update(): void {
                const states = this.state.entities
                        .map((x) => x.getComponent('state') as StateComponent)
                        .filter((x) => x !== undefined)
                states.forEach((x) => this.calculateAnimationState(x))
        }

        private calculateAnimationState(stateComponent: StateComponent) {
                const entity = stateComponent.entity
                if (!entity) return
                const spriteComponent = entity.getComponent('sprite') as SpriteComponent
                if (!spriteComponent) return
                if (!spriteComponent.animated) return
                const movementComponent = entity.getComponent('movement') as MovementComponent
                if (!movementComponent) return
                const movementVector = movementComponent.movementVector
                if (stateComponent.state == 'idle') {
                        spriteComponent.state = 'idle'
                } else if (stateComponent.state == 'movement') {
                        if (movementVector.x > 0) {
                                spriteComponent.state = 'runRight'
                        } else if (movementVector.x < 0) {
                                spriteComponent.state = 'runLeft'
                        } else if (movementVector.y > 0) {
                                spriteComponent.state = 'runDown'
                        } else if (movementVector.y < 0) {
                                spriteComponent.state = 'runUp'
                        }
                }
        }
}
