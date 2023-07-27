import { Component } from './component.js'

export class StateComponent extends Component {
        public state: string
        constructor() {
                super()
                this.state = 'idle'
        }
}
