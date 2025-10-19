import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient>;

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL!,
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });
  }

  // すでに接続済みでない場合は connect()
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
}
