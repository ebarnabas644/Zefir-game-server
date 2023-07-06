import { gameState } from "./server"
import { PositionComponent } from "./entity/Components/positionComponent"

export class PlayerCommandManager{
    private activeCommands: {[key: string]: Set<string>}

    constructor(){
        this.activeCommands = {}
    }

    public setCommands(commands: Set<string>, socketId: string){
        this.activeCommands[socketId] = new Set(commands)
    }

    public deleteCommands(socketId: string){
      delete this.activeCommands[socketId]
    }

    public ExecuteCommands(){
        for (const key in this.activeCommands) {
          let target = gameState.entities['players'][key]
          const posComp = target.getComponent('position') as PositionComponent
          for (const command of this.activeCommands[key]) {
            if(command == "leftMoveCommand"){
              posComp.position.x -= 5
            }
            else if(command == "rightMoveCommand"){
              posComp.position.x += 5
            }
            else if(command == "upMoveCommand"){
              posComp.position.y -= 5
            }
            else if(command == "downMoveCommand"){
              posComp.position.y += 5
            }
          }
        }
        
    }
}