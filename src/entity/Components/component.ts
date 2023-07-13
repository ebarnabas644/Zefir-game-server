import { Entity } from '../entity.js'

export abstract class Component{
    protected entity?: Entity
  
    public onAttach(entity: Entity){
    }
  
    public onDetach(entity: Entity){
      this.entity = undefined
    }
  }