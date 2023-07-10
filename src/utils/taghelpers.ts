import type { EntityDictionary } from '../gameState'

export function findPlayer(socketId: string, state: EntityDictionary){
    const result = state.find(entity => entity.findTag('controlledby') == socketId)
    return state.find(entity => entity.findTag('controlledby') == socketId)
}

export function findPlayers(state: EntityDictionary){
    return state.filter(entity => entity.findTag('controlledby'))
}