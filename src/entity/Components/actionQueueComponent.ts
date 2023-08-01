import { Component } from './component.js'

export type Action = {
        name: string
        data?: { [key: string]: unknown }
}

export class ActionQueueComponent extends Component {
        public actions: Action[]

        constructor() {
                super()
                this.actions = []
        }
        }
}
