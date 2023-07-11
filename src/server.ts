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
import { findPlayer } from './utils/taghelpers';

export const gameState = new GameState()
const playerCommandManager = new PlayerCommandManager(gameState)

const app: any = express();
const server = createServer(app);
const connectedSockets: string[] = []
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    },
    allowEIO3: true
});

app.use(cors({
    origin: 'http://localhost:5173/'
}))

io.on('connection', (socket: Socket) => {
  console.log('Player connected: '+ socket.id);
  // Handle socket events and logic here

  socket.on('message', (message: string) => {
    console.log('Message received: ' + message)
    socket.broadcast.emit('response', findPlayer(socket.id, gameState.entities)?.name + ": "+ message)
  })

  socket.on('newPlayer', (name: string) => {
    const player = new Entity(name)
    player.addComponent('health', new HealthComponent(100))
    player.addComponent('position', new PositionComponent(Math.floor(Math.random() * (200 - 50 + 1)) + 50, Math.floor(Math.random() * (200 - 50 + 1)) + 50))
    player.addComponent('sprite', new SpriteComponent('player.png'))
    player.addTag('controlledby', socket.id)
    gameState.entities.push(player)
    connectedSockets.push(socket.id)
    socket.emit('playerCreated', gameState.convertEntityToDTO(player))
    socket.on('playerCommand', (commands: any) => {
      playerCommandManager.setCommands(commands, socket.id)
    })
  })

  socket.on('disconnect', () => {
    const playerToRemove = findPlayer(socket.id, gameState.entities)
    if(playerToRemove){
      gameState.removeEntity(playerToRemove)
    }
    console.log("Player disconnected: "+socket.id)
    const index = connectedSockets.indexOf(socket.id)
    if(index !== -1){
      connectedSockets.splice(index, 1)
    }
  })
});

setInterval(() => {
  playerCommandManager.ExecuteCommands()
  io.sockets.emit('state', gameState.convertToEntityDTOArray())
}, 1000 / 60)


server.listen(3000, () => {
  console.log('Socket server listening on port 3000');
});