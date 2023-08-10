import { Vec2 } from '@thi.ng/vectors'
import { Entity } from '../entity/entity.js'
import { readFileSync, readdirSync } from 'fs'
import { PositionComponent } from '../entity/Components/positionComponent.js'
import { TileComponent } from '../entity/Components/tileComponent.js'

export type Map = {
        name: string
        width: number
        height: number
        tileHeight: number
        tileWidth: number
        data: { [key: string]: Layer }
        tilesetInfo: TilesetInfo[]
}

export type TilesetInfo = {
        firstid: number
        tilesetName: string
}

export type Layer = {
        name: string
        //data: { [key: string]: Chunk }
        data: Entity[]
}

export type Chunk = {
        position: Vec2
        data: Entity[]
}

export class MapDictionary {
        chunkSize: number
        mapDictionary: { [key: string]: Map }

        constructor(chunkSize: number) {
                this.mapDictionary = {}
                this.chunkSize = chunkSize
                this.loadMap('map1')
        }

        loadMap(mapName: string) {
                const fileNames = readdirSync('./dist/assets/maps')
                console.log(fileNames)
                const data = readFileSync('./dist/assets/maps' + '/map1.tmj', 'utf-8')
                const json = JSON.parse(data)
                const map: Map = {
                        name: 'map1',
                        width: json.height,
                        height: json.width,
                        tileHeight: json.tileheight,
                        tileWidth: json.tilewidth,
                        data: {},
                        tilesetInfo: []
                }
                this.mapDictionary[mapName] = map
                this.loadTilesetInfo(json, mapName)
                this.loadLayers(json, mapName)
        }

        private loadTilesetInfo(result: any, mapName: string) {
                const mapData = this.mapDictionary[mapName]
                for (const tilesetData of result.tilesets) {
                        const tilesetPath = tilesetData.source.split('/')
                        const tilesetName = tilesetPath[tilesetPath.length - 1].split('.')[0]
                        const tilesetInfo: TilesetInfo = {
                                firstid: tilesetData.firstgid,
                                tilesetName: tilesetName
                        }
                        mapData.tilesetInfo.push(tilesetInfo)
                }
                mapData.tilesetInfo.reverse()
                console.log(mapData.tilesetInfo)
        }

        private loadLayers(result: any, mapName: string) {
                //console.log(result.layers)
                const mapData = this.mapDictionary[mapName]
                for (const layerData of result.layers) {
                        //console.log(layerData)
                        let counter = 0
                        mapData.data[layerData.name] = {
                                name: layerData.name,
                                data: []
                        }
                        const position = new Vec2([0, 0])
                        for (const tileData of layerData.data) {
                                const tile = this.createTile(tileData, position, mapName)
                                if (!tile) continue
                                mapData.data[layerData.name].data.push(tile)
                                counter++
                                position.x = (counter * mapData.tileWidth) % (mapData.width * mapData.tileWidth)
                                position.y = Math.floor(counter / mapData.height) * mapData.tileHeight
                        }
                }
        }

        private createTile(spriteId: number, position: Vec2, mapName: string) {
                const tilesetInfo = this.convertTileIdToTilesetInfo(spriteId, mapName)
                if (!tilesetInfo) return
                const tile = new Entity(spriteId + '')
                tile.addComponent('tile', new TileComponent(spriteId - tilesetInfo.firstid, tilesetInfo.tilesetName))
                tile.addComponent('position', new PositionComponent(position.x, position.y))
                return tile
        }

        private convertTileIdToTilesetInfo(tileId: number, mapName: string) {
                return this.mapDictionary[mapName].tilesetInfo.find((x) => x.firstid <= tileId)
        }

        getLayer(map: string, layer: string) {}

        getChunkEntities(position: Vec2) {}
}
