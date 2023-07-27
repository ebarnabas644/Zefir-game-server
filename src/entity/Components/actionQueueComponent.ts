import { Component } from './component.js'

export class ActionQueueComponent extends Component {
        public actions: Set<string>

        constructor() {
                super()
                this.actions = new Set<string>()
        }
}
