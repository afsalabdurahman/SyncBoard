// infrastructure/logger/WinstonLoggerImpl.ts
import { ILogger } from '../../application/repositories/ilogger/ILogger'; 
import { WinstonLogger } from './WingtonLogger';

export class WinstonLoggerImpl implements ILogger {
  info(message: string): void {
    WinstonLogger.info(message);
  }

  warn(message: string): void {
    WinstonLogger.warn(message);
  }

  debug(message: string): void {
    WinstonLogger.debug(message);
  }

  error(message: string | Error): void {
    if (message instanceof Error) {
      WinstonLogger.error(message); // Winston handles stack automatically
    } else {
      WinstonLogger.error(message);
    }
  }
}