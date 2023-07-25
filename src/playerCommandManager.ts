import { gameState } from "./server.js"
import { PositionComponent } from "./entity/Components/positionComponent.js"
import { findPlayer, findPlayers } from "./utils/taghelpers.js"
import { EntityDictionary, GameState } from "./gameState.js"
import { MovementComponent } from "./entity/Components/movementComponent.js"

export class PlayerCommandManager{
    private activeCommands: {[key: string]: Set<string>}
    private state: GameState
    private horizontalInputAxis: number
    private verticalInputAxis: number
    constructor(gameState: GameState){
        this.activeCommands = {}
        this.state = gameState
        this.horizontalInputAxis = 0
        this.verticalInputAxis = 0
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
          const movementComponent = player.getComponent('movement') as MovementComponent
          const posComp = player.getComponent('position') as PositionComponent
          if(player.commandBuffer.size == 0){
            this.horizontalInputAxis = 0
            this.verticalInputAxis = 0
          }
            for (const command of player.commandBuffer) {
              if(command == "leftMoveCommand"){
                this.horizontalInputAxis = -7
              }
              else if(command == "rightMoveCommand"){
                this.horizontalInputAxis = 7
              }
              else if(command == "upMoveCommand"){
                this.verticalInputAxis = -7
              }
              else if(command == "downMoveCommand"){
                this.verticalInputAxis = 7
              }
            }
            
            movementComponent.setMovementVector(this.horizontalInputAxis, this.verticalInputAxis)
            this.horizontalInputAxis = 0
            this.verticalInputAxis = 0
        }
    }
}