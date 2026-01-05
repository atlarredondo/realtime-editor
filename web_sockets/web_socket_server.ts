import { WebSocket, WebSocketServer } from "ws";
import { type Request } from "express";
import { socketManager } from "./socket_manager";
import { prisma } from "../lib/prisma";
import { redisSubClient } from "../redis/redis_client";

export const wss = new WebSocketServer({ noServer: true });

wss.on("connection", async (ws: WebSocket, request: Request) => {
  const userId = ws.userId;

  if (userId) {
    socketManager.setUserSocket(userId, ws);
    console.log(`User ${userId} connected via websocket`);

    // we subscribe to all the users projects

    const userProjects = await prisma.projectCollaborator.findMany({
      where: { userId },
    });

    // On socket connection we initialize redisClient to subscribe
    userProjects.forEach(async ({ projectId }) => {
      await redisSubClient.subscribe(`project-${projectId}`, (message) => {
        console.log("SUBS: About to push payload to", projectId, message);

        ws.send(message);
      });
    });

    ws.on("close", () => {
      socketManager.deleteUserSocketValue(userId);
      console.log(`User ${userId} disconnected`);
    });
  }
});
