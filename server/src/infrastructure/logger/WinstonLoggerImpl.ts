import { ILogger } from '../../application/repositories/ilogger/ILogger';
import { WinstonLogger } from './WinstonLogger';

export class WinstonLoggerImpl implements ILogger {
  info(message: string): void {
    WinstonLogger.info(message);
  }

  error(message: string | Error): void {
    if (message instanceof Error) {
      WinstonLogger.error(message.stack || message.message);
    } else {
      WinstonLogger.error(message);
    }
  }

  warn(message: string): void {
    WinstonLogger.warn(message);
  }

  debug(message: string): void {
    WinstonLogger.debug(message);
  }
}
