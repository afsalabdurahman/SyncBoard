// infrastructure/logger/LoggerFactory.ts
import { ILogger } from '../../application/repositories/ilogger/ILogger';
import { WinstonLoggerImpl } from './WinstonLoggerImpl';
import { ConsoleLogger } from './ConsoleLogger';

export class LoggerFactory {
  private static instance: ILogger;

  static getLogger(): ILogger {
    if (!this.instance) {
   
      if (process.env.NODE_ENV === 'production') {
        this.instance = new WinstonLoggerImpl();
      } else {
        this.instance = new ConsoleLogger();
      }
    }
    return this.instance;
  }
}