import { createClient } from "redis";

const REDIS_URL = "redis://default:redispw@localhost:55000";
export const mainRedisClient = await createClient({
  url: REDIS_URL,
})
  .on("error", (err) => console.log("Redis client err", err))
  .connect();

// Client for Publishing and standard commands
export const redisPubClient = await createClient({ url: REDIS_URL })
  .on("error", (err) => console.log("Pub Client Error", err))
  .connect();

// Client for Subscribing only
export const redisSubClient = await createClient({ url: REDIS_URL })
  .on("error", (err) => console.log("Sub Client Error", err))
  .connect();

// export async function createRedisClientAsync() {
//   const client = createClient({ url: REDIS_URL });
//
//   client.on("error", (err) => console.log("Redis client err", err));
//   await client.connect();
//   return client;
// }
