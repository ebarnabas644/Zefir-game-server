import express, { Request, Response } from 'express'
import { Express } from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'
import cors from 'cors'
import { GameState } from './gameState.js'
import { Entity } from './entity/entity.js'
import { HealthComponent } from './entity/Components/healthComponent.js'
import { PositionComponent } from './entity/Components/positionComponent.js'
import { RequirementCallback, SpriteComponent } from './entity/Components/spriteComponent.js'
import { MovementComponent } from './entity/Components/movementComponent.js'
import { ActionQueueComponent } from './entity/Components/actionQueueComponent.js'
import { InputSystem } from './systems/inputSystem.js'
import { ActionExecutionSystem } from './systems/actionExecutionSystem.js'
import { StateComponent } from './entity/Components/stateComponent.js'
import { AnimationStateSystem } from './systems/animationStateSystem.js'
import { MovementSystem } from './systems/movementSystem.js'
import { MapInitSystem } from './systems/mapInitSystem.js'
import { HitboxComponent } from './entity/Components/hitboxComponent.js'
import { MonsterSpawnerSystem } from './systems/monsterSpawnerSystem.js'
import { StrategyPlayerSystem } from './systems/strategyPlayerSystem.js'
import { StrategyStateUpdateSystem } from './systems/strategyStateUpdateSystem.js'

const startDate = Date.now()
export const gameState = new GameState()
const mapInitSystem = new MapInitSystem(gameState, './dist/assets/maps')
mapInitSystem.start()
const inputSystem = new InputSystem(gameState)
const actionExecutionSystem = new ActionExecutionSystem(gameState)
const animationStateSystem = new AnimationStateSystem(gameState)
const movementSystem = new MovementSystem(gameState)
const monsterSpawnerSystem = new MonsterSpawnerSystem(gameState)
const strategyPlayerSystem = new StrategyPlayerSystem(gameState)
const strategyUpdateSystem = new StrategyStateUpdateSystem(gameState)

const app: Express = express()
const httpServer = http.createServer(app)
const connectedSockets: string[] = []
const io = new Server(httpServer, {
        cors: {
                origin: ['http://localhost:5173', 'https://zefir.iedre.dev/', 'https://iedre.dev/']
        },
        allowEIO3: true,
        pingTimeout: 5000
})

app.use(
        cors({
                origin: ['http://localhost:5173', 'https://zefir.iedre.dev/', 'https://iedre.dev/']
        })
)

io.on('connection', (socket: Socket) => {
        console.log('Player connected: ' + socket.id)

        socket.on('message', (message: string) => {
                socket.broadcast.emit('response', gameState.findPlayer(socket.id)?.name + ': ' + message)
        })

        socket.on('newPlayer', (name: string) => {
                const player = new Entity(name)
                console.log('Player ' + name + ' created')
                player.addComponent('health', new HealthComponent(100))
                player.addComponent(
                        'position',
                        new PositionComponent(
                                Math.floor(Math.random() * (200 - 50 + 1)) + 50,
                                Math.floor(Math.random() * (200 - 50 + 1)) + 50
                        )
                )
                player.addComponent('sprite', new SpriteComponent('player.png', true, 'idle'))
                player.addComponent('hitbox', new HitboxComponent(48, 48))
                player.addComponent('movement', new MovementComponent())
                player.addComponent('actionQueue', new ActionQueueComponent())
                player.addComponent('state', new StateComponent())
                player.addTag('controlledby', socket.id)
                player.addTag('targetableByMob', true)
                player.initComponents()
                gameState.entities.push(player)
                connectedSockets.push(socket.id)
                socket.emit('playerCreated', player.name)
                socket.broadcast.emit('chat-playerJoined', player.name)
        })

        socket.on('playerCommand', (commands: string[]) => {
                //playerCommandManager.setCommands(commands, socket.id)
                inputSystem.setInputs(commands, socket.id)
        })

        socket.on('disconnect', () => {
                const playerToRemove = gameState.findPlayer(socket.id)
                if (playerToRemove) {
                        gameState.removeEntity(playerToRemove)
                }
                console.log('Player disconnected: ' + socket.id)
                const index = connectedSockets.indexOf(socket.id)
                if (index !== -1) {
                        connectedSockets.splice(index, 1)
                }
        })
})

setInterval(() => {
        //console.time('tick')
        //playerCommandManager.ExecuteCommands()
        actionExecutionSystem.update()
        movementSystem.update()
        animationStateSystem.update()
        monsterSpawnerSystem.update()
        strategyUpdateSystem.update()
        strategyPlayerSystem.update()
        runEntityLogic()
        io.sockets.emit('state', gameState.convertToEntityDTOArray())
        //console.timeEnd('tick')
}, 1000 / 60)

app.get('/', (req: Request, res: Response) => {
        res.send('Hello, this is your Express.js server! Running since: ' + startDate)
})

app.get('/health', (req: Request, res: Response) => {
        res.sendStatus(200)
})

httpServer.listen(3000, () => {
        console.log('Socket server listening on port 3000')
})

function runEntityLogic() {
        for (const entity of gameState.entities) {
                entity.updateComponents()
        }
}
