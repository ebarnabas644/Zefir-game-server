import { Container } from 'inversify'
import { TYPES } from './inversify.types.js'
import { ISystem } from './systems/Interfaces/ISystem.js'
import { AnimationStateSystem } from './systems/animationStateSystem.js'
import { IGameState } from './gameState/IGameState.js'
import { GameState } from './gameState/gameState.js'
import { buildProviderModule } from 'inversify-binding-decorators'

import './strategies/animationState/attackAnimationStrategy.js'

// TODO: replace manual side effect import with plop library generation
const container = new Container()
container.bind<ISystem>(TYPES.ISystem).to(AnimationStateSystem)

container.bind<IGameState>(TYPES.IGameState).to(GameState).inSingletonScope()
container.load(buildProviderModule())
console.log(container)
export { container }
