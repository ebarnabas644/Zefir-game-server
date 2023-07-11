import { gameState } from "./server"
import { PositionComponent } from "./entity/Components/positionComponent"
import { findPlayer, findPlayers } from "./utils/taghelpers"
import { EntityDictionary, GameState } from "./gameState"

export class PlayerCommandManager{
    private activeCommands: {[key: string]: Set<string>}
    private state: GameState
    constructor(gameState: GameState){
        this.activeCommands = {}
        this.state = gameState
    }

    public setCommands(commands: Set<string>, socketId: string){
      const player = findPlayer(socketId, this.state.entities)
      if(player){
        player.commandBuffer = new Set(commands)
      }
    }

    public deleteCommands(socketId: string){
      delete this.activeCommands[socketId]
    }

    public ExecuteCommands(){
        const players = findPlayers(this.state.entities)
        for (let index = 0; index < players.length; index++) {
          const player = players[index];
          const posComp = player.getComponent('position') as PositionComponent
            for (const command of player.commandBuffer) {
              if(command == "leftMoveCommand"){
                posComp.position.x -= 7
              }
              else if(command == "rightMoveCommand"){
                posComp.position.x += 7
              }
              else if(command == "upMoveCommand"){
                posComp.position.y -= 7
              }
              else if(command == "downMoveCommand"){
                posComp.position.y += 7
              }
            }
        }
    }
}