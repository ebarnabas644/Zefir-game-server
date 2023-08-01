import { Component } from './component.js'

export class StrategyComponent extends Component {
        public strategy: string

        constructor() {
                super()
                this.strategy = 'idle'
        }
}
