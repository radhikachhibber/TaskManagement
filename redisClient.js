import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({ 
    host: process.env.REDIS_HOST || "redis",  
    port: process.env.REDIS_PORT || 6379,
})

export default redis;