import { Entity } from '../entity.js'

export abstract class Component {
        public entity?: Entity

        public onAttach(entity: Entity) {
                this.entity = entity
        }

        public onDetach(entity: Entity) {
                this.entity = undefined
        }
}
