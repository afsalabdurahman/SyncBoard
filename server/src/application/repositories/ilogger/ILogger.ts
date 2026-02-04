export interface ILogger {
  info(message: string): void;
  error(message: string | Error): void;
  warn(message: string): void;
  debug(message: string): void;
}
