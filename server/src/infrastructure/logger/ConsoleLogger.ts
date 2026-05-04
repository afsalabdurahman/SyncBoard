import { ILogger } from "../../application/repositories/ilogger/ILogger";

export class ConsoleLogger implements ILogger {
  info(message: string): void {
    console.log("INFO:", message);
  }

  error(message: string | Error): void {
    console.error("ERROR:", message);
  }

  warn(message: string): void {
    console.warn("WARN:", message);
  }

  debug(message: string): void {
    console.debug("DEBUG:", message);
  }
}