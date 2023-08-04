import { ISystem } from './Interfaces/ISystem.js'
import { MapDictionary } from '../models/mapDictionary.js'
import { TYPES } from '../inversify.types.js'
import { IGameState } from '../gameState/IGameState.js'
import { injectable, inject } from 'inversify'

@injectable()
export class MapInitSystem implements ISystem {
        state: IGameState
        mapDataFolderPath: string
        constructor(@inject(TYPES.IGameState) state: IGameState, mapDataFolderPath: string) {
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
