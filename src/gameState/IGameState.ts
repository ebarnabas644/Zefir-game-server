import { Entity } from '../entity/entity.js'
import { EntityDTODictionary } from './gameState.js'

export interface IGameState {
        getEntities(): Entity[]
        getMonsterSpawners(): Entity[]
        findPlayer(socketId: string): Entity | undefined
        removeEntity(entity: Entity): void
        convertToEntityDTOArray(): EntityDTODictionary
}
