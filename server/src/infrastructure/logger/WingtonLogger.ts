
import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = format;


const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}] : ${stack || message}`;
});


const rootDir = path.resolve(__dirname, '../../../..'); 

export const WinstonLogger = createLogger({
  level: process.env.LOG_LEVEL || 'info',

  format: combine(
    colorize(),                   
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),       
    logFormat
  ),

  transports: [
    // Console transport
    new transports.Console(),

    // File transport
    new transports.File({
      filename: `${rootDir}/logs/app.log`,
      maxsize: 5242880,        // 5MB
      maxFiles: 5,
    }),
  ],

  exceptionHandlers: [
    new transports.File({
      filename: `${rootDir}/logs/exceptions.log`,
      maxsize: 5242880,
      maxFiles: 3,
    }),
  ],

  rejectionHandlers: [
    new transports.File({
      filename: `${rootDir}/logs/rejections.log`,
      maxsize: 5242880,
      maxFiles: 3,
    }),
  ],
});