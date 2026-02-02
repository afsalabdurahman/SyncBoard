import { createLogger, format, transports } from 'winston';
<<<<<<< HEAD

=======
import path from "path";
>>>>>>> fix/eslint
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] : ${stack || message}`;
});
<<<<<<< HEAD
=======
const rootDir = path.resolve(__dirname, "../../../../");
>>>>>>> fix/eslint

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
<<<<<<< HEAD
    new transports.File({ filename: 'logs/app.log' }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' }),
=======
    new transports.File({ filename: `${rootDir}/logs/app.log` }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: `${rootDir}/logs/exceptions.log` }),
>>>>>>> fix/eslint
  ],
});
