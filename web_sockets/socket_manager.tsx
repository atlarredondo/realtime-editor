import { WebSocket } from "ws";
import { redisPubClient } from "../redis/redis_client";

class SocketManager {
  private socketByUserId: Map<number, WebSocket>;

  constructor() {
    this.socketByUserId = new Map<number, WebSocket>();
  }

  public setUserSocket(userId: number, webSocket: WebSocket) {
    const maybeExistingSocket = this.socketByUserId.get(userId);

    if (maybeExistingSocket) {
      // Closing the socket if it already exists
      maybeExistingSocket.close();
    }
    this.socketByUserId.set(userId, webSocket);
  }

  public sendPayloadToUserIfPossible(userId: number, payload: any) {
    const maybeExistingSocket = this.socketByUserId.get(userId);

    if (
      maybeExistingSocket &&
      maybeExistingSocket.readyState === WebSocket.OPEN
    ) {
      maybeExistingSocket.send(JSON.stringify(payload));
    }
  }

  public async publishPayloadAsync(projectId: number, payload: string) {
    console.log("About to publish payload to", projectId, payload);
    await redisPubClient.publish(`project-${projectId}`, payload);
  }

  public deleteUserSocketValue(userId: number) {
    this.socketByUserId.delete(userId);
  }
}

export const socketManager = new SocketManager();
