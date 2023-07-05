import { HealthComponent } from './entity/Components/healthComponent'
import { PositionComponent } from './entity/Components/positionComponent'
import { SpriteComponent } from './entity/Components/spriteComponent'
import { Entity } from './entity/entity'

type EntityDictionary = { [key: string]: { [key: string]: Entity }}
type EntityDTO = {
    id: number,
    health: number,
    position: { x: number, y: number },
    sprite: string
}

type EntityDTODictionary = { [key: string]: EntityDTO[]}

export class GameState{
    public entities: EntityDictionary

    constructor(){
        this.entities = {}
        this.entities['players'] = {}
    }

    public convertToEntityDTOArray(): EntityDTODictionary{
        const entityDTODictionary: EntityDTODictionary = {}
        for (const key in this.entities) {
            entityDTODictionary[key] = []
            for (const entityKey in this.entities[key]) {
                const entityDTO = this.convertEntityToDTO(this.entities[key][entityKey])
                entityDTODictionary[key].push(entityDTO)
            }
        }

        return entityDTODictionary
    }

    private convertEntityToDTO(entity: Entity): EntityDTO{
        const healthComponent = entity.getComponent('health') as HealthComponent
        const positionComponent = entity.getComponent('position') as PositionComponent
        const spriteComponent = entity.getComponent('sprite') as SpriteComponent
        const entityDTO: EntityDTO = {
            id: entity.id,
            health: healthComponent.health,
            position: { x: positionComponent.position.x, y: positionComponent.position.y },
            sprite: spriteComponent.spritePath
        }

        return entityDTO
    }
}