import { GameState } from '../gameState.js'
import { ISystem } from './Interfaces/ISystem.js'
import { MapDictionary } from '../models/mapDictionary.js'

export class MapInitSystem implements ISystem {
        state: GameState
        mapDataFolderPath: string
        constructor(state: GameState, mapDataFolderPath: string) {
                this.state = state
                this.mapDataFolderPath = mapDataFolderPath
        }

        start(): void {
                const map = new MapDictionary(10)
        }
        update(): void {
                throw new Error('Method not implemented.')
        }
}
