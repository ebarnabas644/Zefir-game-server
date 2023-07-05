import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors'
import { players } from './gameState';

const app: any = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

app.use(cors({
    origin: 'http://localhost:5173/'
}))

io.on('connection', (socket: Socket) => {
  console.log('Player connected: '+ socket.id);
  // Handle socket events and logic here

  socket.on('message', (message: string) => {
    console.log('Message received: ' + message)
    socket.broadcast.emit('response', socket.id + ": "+ message)
  })

  socket.on('newPlayer', () => {
    players[socket.id] = {
      x: Math.floor(Math.random() * 201) + 200,
      y: Math.floor(Math.random() * 201) + 200,
      width: 25,
      height: 25
    }
  })

  socket.on('disconnect', () => {
    delete players[socket.id]
    console.log("Player disconnected: "+socket.id)
  })
});

setInterval(() => {
  if(connectedSockets[0]){
    const healthComponent = gameState.entities['players'][connectedSockets[0]].getComponent('health') as HealthComponent
    healthComponent.health -= 1
  }
  io.sockets.emit('state', gameState.convertToEntityDTOArray())
}, 1000 / 30)


server.listen(3000, () => {
  console.log('Socket server listening on port 3000');
});