import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimiter',
  points: 5,
  duration: 1,
  inmemoryBlockOnConsumed: 5,
  inmemoryBlockDuration: 60,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);
    return next();
  } catch (err) {
    throw new AppError('too many request', 429);
  }
}
