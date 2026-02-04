import { createLogger, format, transports } from 'winston';
import path from "path";
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] : ${stack || message}`;
});
const rootDir = path.resolve(__dirname, "../../../../");

export const WinstonLogger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: `${rootDir}/logs/app.log` }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: `${rootDir}/logs/exceptions.log` }),
  ],
});
