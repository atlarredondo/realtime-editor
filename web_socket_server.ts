import {WebSocket, WebSocketServer} from 'ws';
import {type Request} from 'express';

export const wss = new WebSocketServer({noServer: true});

export const userSockets = new Map<number, WebSocket>();

wss.on('connection', (ws: WebSocket, request: Request) => {
    const userId = ws.userId;

    console.log('this is the user', userId)
    if(userId){
        userSockets.set(userId, ws);
        console.log(`User ${userId} connected via websocket`)
        ws.on('close', () => {
            userSockets.delete(userId)
            console.log(`User ${userId} disconnected`);
        })
    }
});