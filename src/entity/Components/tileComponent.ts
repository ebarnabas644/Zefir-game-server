import { Component } from './component.js'

export class TileComponent extends Component {
        constructor(
                public tileId: number,
                public tileSetFile: string
        ) {
                super()
        }
}
