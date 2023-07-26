import express from 'express';
import { createServer } from 'https';
import http from 'http'
import https from 'https'
import { Server, Socket } from 'socket.io';
import cors from 'cors'
import { GameState } from './gameState.js';
import { Entity } from './entity/entity.js';
import { HealthComponent } from './entity/Components/healthComponent.js'
import { PositionComponent } from './entity/Components/positionComponent.js'
import { SpriteComponent } from './entity/Components/spriteComponent.js'
import { PlayerCommandManager } from './playerCommandManager.js';
import { findPlayer } from './utils/taghelpers.js';
import { MovementComponent } from './entity/Components/movementComponent.js';

const startDate = Date.now()
export const gameState = new GameState()
const playerCommandManager = new PlayerCommandManager(gameState)

const app: any = express();
const httpServer = http.createServer(app)
const httpsServer = https.createServer(app)
const connectedSockets: string[] = []
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'https://zefir.iedre.dev/', 'https://iedre.dev/']
    },
    allowEIO3: true,
    pingTimeout: 5000
});

app.use(cors({
    origin: ['http://localhost:5173', 'https://zefir.iedre.dev/', 'https://iedre.dev/']
}))

io.on('connection', (socket: Socket) => {
  console.log('Player connected: '+ socket.id);
  // Handle socket events and logic here

  socket.on('message', (message: string) => {
    //console.log('Message received: ' + message)
    socket.broadcast.emit('response', findPlayer(socket.id, gameState.entities)?.name + ": "+ message)
  })

  socket.on('newPlayer', (name: string) => {
    const player = new Entity(name)
    console.log('Player '+name+' created')
    player.addComponent('health', new HealthComponent(100))
    player.addComponent('position', new PositionComponent(Math.floor(Math.random() * (200 - 50 + 1)) + 50, Math.floor(Math.random() * (200 - 50 + 1)) + 50))
    player.addComponent('sprite', new SpriteComponent('player.png', true, 'idle'))
    player.addComponent('movement', new MovementComponent())
    const spriteComponent = player.getComponent('sprite') as SpriteComponent
    if(spriteComponent){
      const movementComponent = player.getComponent('movement') as MovementComponent
      if(movementComponent){
        spriteComponent.addState({
          name: 'idle',
          requirement: (movementComponent: MovementComponent) => {
            if(movementComponent.movementVector.x == 0 && movementComponent.movementVector.y == 0){
              return true
            }
            return false
          },
          params: [movementComponent]
        })
        spriteComponent.addState({
          name: 'runRight',
          requirement: (movementComponent: MovementComponent) => {
            if(movementComponent.movementVector.x > 0){
              return true
            }
            return false
          },
          params: [movementComponent]
        })
        spriteComponent.addState({
          name: 'runLeft',
          requirement: (movementComponent: MovementComponent) => {
            if(movementComponent.movementVector.x < 0){
              return true
            }
            return false
          },
          params: [movementComponent]
        })
        spriteComponent.addState({
          name: 'runUp',
          requirement: (movementComponent: MovementComponent) => {
            if(movementComponent.movementVector.y < 0){
              return true
            }
            return false
          },
          params: [movementComponent]
        })
        spriteComponent.addState({
          name: 'runDown',
          requirement: (movementComponent: MovementComponent) => {
            if(movementComponent.movementVector.y > 0){
              return true
            }
            return false
          },
          params: [movementComponent]
        })
        
      }
    }
    player.addTag('controlledby', socket.id)
    player.initComponents()
    gameState.entities.push(player)
    connectedSockets.push(socket.id)
    socket.emit('playerCreated', player.name)
    socket.broadcast.emit('chat-playerJoined', player.name)
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
  //console.time('tick')
  playerCommandManager.ExecuteCommands()
  runEntityLogic()
  io.sockets.emit('state', gameState.convertToEntityDTOArray())
  //console.timeEnd('tick')
}, 1000 / 60)

app.get('/', (req: any, res: any) => {
  res.send('Hello, this is your Express.js server! Running since: '+startDate);
});

app.get('/health', (req: any, res: any) => {
  res.sendStatus(200)
});

httpServer.listen(3000, () => {
  console.log('Socket server listening on port 3000');
});

function runEntityLogic(){
  for (const entity of gameState.entities) {
    entity.updateComponents()
  }
}