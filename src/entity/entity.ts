import { Component } from './Components/component'
import type { IScript } from './Interfaces/IScript';

let idCounter = 0
// Entity class
export class Entity {
  components: { [key: string]: any };
  name: string
  id: number
  tags: {[key: string]: any}

  constructor(name: string) {
    this.components = {};
    this.name = name
    this.id = idCounter++
    this.tags = {}
  }

  addComponent(componentName: string, component: Component) {
    component.onAttach(this)
    this.components[componentName] = component;
  }

  getComponent(componentName: string): Component {
    return this.components[componentName];
  }

  removeComponent(componentName: string) {
    this.components[componentName].onDetach()
    delete this.components[componentName];
  }

  updateComponents(){
    for (const key in this.components){
      const component = this.components[key]
      if(this.isScriptComponent(component)){
        component.update()
      }
    }
  }

  addTag(key: string, value: any){
    this.tags[key] = value
  }

  removeTag(key: string){
    delete this.tags[key]
  }

  private isScriptComponent(component: any): component is IScript{
    return 'update' in component
  }
}