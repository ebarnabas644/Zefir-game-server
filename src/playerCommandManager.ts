import { gameState } from "./server.js"
import { PositionComponent } from "./entity/Components/positionComponent.js"
import { findPlayer, findPlayers } from "./utils/taghelpers.js"
import { EntityDictionary, GameState } from "./gameState.js"
import { MovementComponent } from "./entity/Components/movementComponent.js"

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
          const movementComponent = player.getComponent('movement') as MovementComponent
          const posComp = player.getComponent('position') as PositionComponent
          if(player.commandBuffer.size == 0){
            movementComponent.stopMovement()
          }
            for (const command of player.commandBuffer) {
              if(command == "leftMoveCommand"){
                movementComponent.setMovementVector(-7, 0)
              }
              else if(command == "rightMoveCommand"){
                movementComponent.setMovementVector(7, 0)
              }
              else if(command == "upMoveCommand"){
                movementComponent.setMovementVector(0, -7)
              }
              else if(command == "downMoveCommand"){
                movementComponent.setMovementVector(0, 7)
              }
            }
        }
    }
}