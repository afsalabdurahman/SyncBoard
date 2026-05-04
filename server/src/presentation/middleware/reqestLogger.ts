
import { Request, Response, NextFunction } from 'express';
import { LoggerFactory } from '../../infrastructure/logger/LoggerFactory';

const logger = LoggerFactory.getLogger();

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    logger.info(logMessage);   // Works with any implementation
  });

  next();
};