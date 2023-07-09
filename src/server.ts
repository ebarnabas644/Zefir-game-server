import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors'
import { GameState } from './gameState';
import { Entity } from './entity/entity';
import { HealthComponent } from './entity/Components/healthComponent'
import { PositionComponent } from './entity/Components/positionComponent'
import { SpriteComponent } from './entity/Components/spriteComponent'
import { PlayerCommandManager } from './playerCommandManager';

export const gameState = new GameState()
const playerCommandManager = new PlayerCommandManager()

const app: any = express();
const server = createServer(app);
const connectedSockets: string[] = []
const io = new Server(server, {
    cors: {
        origin: 'http://25.74.110.92:5173'
    },
    allowEIO3: true
});

app.use(cors({
    origin: 'http://25.74.110.92:5173/'
}))

io.on('connection', (socket: Socket) => {
  console.log('Player connected: '+ socket.id);
  // Handle socket events and logic here

  socket.on('message', (message: string) => {
    console.log('Message received: ' + message)
    socket.broadcast.emit('response', socket.id + ": "+ message)
  })

  socket.on('newPlayer', (name: string) => {
    const player = new Entity(name)
    player.addComponent('health', new HealthComponent(100))
    player.addComponent('position', new PositionComponent(Math.floor(Math.random() * (200 - 50 + 1)) + 50, Math.floor(Math.random() * (200 - 50 + 1)) + 50))
    player.addComponent('sprite', new SpriteComponent('player.png'))
    gameState.entities['players'][socket.id] = player
    gameState.entities['players'][socket.id].addTag('controlledby', socket.id)
    connectedSockets.push(socket.id)
    socket.emit('playerCreated', gameState.convertEntityToDTO(gameState.entities['players'][socket.id]))
    socket.on('playerCommand', (commands: any) => {
      playerCommandManager.setCommands(commands, socket.id)
    })
  })

  socket.on('disconnect', () => {
    playerCommandManager.deleteCommands(socket.id)
    delete gameState.entities['players'][socket.id]
    console.log("Player disconnected: "+socket.id)
    const index = connectedSockets.indexOf(socket.id)
    if(index !== -1){
      connectedSockets.splice(index, 1)
    }
  })
});

setInterval(() => {
  playerCommandManager.ExecuteCommands()
  if(connectedSockets[0]){
    const healthComponent = gameState.entities['players'][connectedSockets[0]].getComponent('health') as HealthComponent
    //healthComponent.health -= 1
  }
  io.sockets.emit('state', gameState.convertToEntityDTOArray())
}, 1000 / 60)


server.listen(3000, () => {
  console.log('Socket server listening on port 3000');
});