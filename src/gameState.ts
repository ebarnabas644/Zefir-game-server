import { HealthComponent } from './entity/Components/healthComponent.js'
import { PositionComponent } from './entity/Components/positionComponent.js'
import { SpriteComponent } from './entity/Components/spriteComponent.js'
import { Entity } from './entity/entity.js'

export type EntityDictionary = Entity[]
export type EntityDTO = {
    id: number,
    name: string,
    health: number,
    position: { x: number, y: number },
    sprite: string,
    state: string,
    tags: {[key: string]: any}
}

type EntityDTODictionary = EntityDTO[]

export class GameState{
    public entities: EntityDictionary

    constructor(){
        this.entities = []
    }

    public convertToEntityDTOArray(): EntityDTODictionary{
        const entityDTODictionary: EntityDTODictionary = []
        for (let index = 0; index < this.entities.length; index++) {
            const entityDTO = this.convertEntityToDTO(this.entities[index])
            entityDTODictionary.push(entityDTO)
        }

        return entityDTODictionary
    }

    convertEntityToDTO(entity: Entity): EntityDTO{
        const healthComponent = entity.getComponent('health') as HealthComponent
        const positionComponent = entity.getComponent('position') as PositionComponent
        const spriteComponent = entity.getComponent('sprite') as SpriteComponent
        const entityDTO: EntityDTO = {
            id: entity.id,
            name: entity.name,
            health: healthComponent.health,
            position: { x: positionComponent.position.x, y: positionComponent.position.y },
            sprite: spriteComponent.spritePath,
            state: spriteComponent.state,
            tags: {}
        }

        for (const key in entity.tags) {
            entityDTO.tags[key] = entity.tags[key]
        }

        return entityDTO
    }

    removeEntity(entity: Entity){
        this.entities = this.entities.filter(element => element.id !== entity.id)
    }
}