import { GetMetaDataFunction, Logger, LogLevel } from "@bentley/bentleyjs-core";

export enum LoggingCategory {
 PlacePinTool = "PlacePinTool",
 ProductSettingsService = "ProductSettingsService",
}
export class Logging {
 private static isLocalHost: boolean;

 public static consoleLog(...args: any[]): void {
  if (this.isLocalHost) {
   // eslint-disable-next-line no-console
   console.log(...args);
  }
 }

 public static Initialize(): void {
  const error = (category: string, message: string, getMetaData: GetMetaDataFunction = () => ({})) => {
   this.log(LogLevel.Error, category, message, getMetaData);
  };
  const warning = (category: string, message: string, getMetaData: GetMetaDataFunction = () => ({})) => {
   this.log(LogLevel.Warning, category, message, getMetaData);
  };
  const info = (category: string, message: string, getMetaData: GetMetaDataFunction = () => ({})) => {
   this.log(LogLevel.Info, category, message, getMetaData);
  };
  const trace = (category: string, message: string, getMetaData: GetMetaDataFunction = () => ({})) => {
   this.log(LogLevel.Trace, category, message, getMetaData);
  };

  // initialize logger
  /** Initialize the logger streams. Should be called at application initialization time. */
  // static initialize(logError: LogFunction | undefined, logWarning?: LogFunction | undefined, logInfo?: LogFunction | undefined, logTrace?: LogFunction | undefined): void;
  // export declare type LogFunction = (category: string, message: string, metaData?: GetMetaDataFunction) => void;
  Logger.initialize(error, warning, info, trace);

  /** Set the least severe level at which messages should be displayed by default. Call setLevel to override this default setting for specific categories. */
  // @params minlevel
  Logger.setLevelDefault(LogLevel.Warning);

  /** Set the minimum logging level for the specified category. The minimum level is least severe level at which messages in the
   * specified category should be displayed.
   */
  Logger.setLevel(LoggingCategory.PlacePinTool, LogLevel.Info);

  this.isLocalHost = this._logToConsole;
 }

 private static get _logToConsole(): boolean {
  return window.location.host.includes("localhost");
 }

 private static async log(logType: LogLevel, category: string, message: string, getMetaData: GetMetaDataFunction) {
  try {
   // Post/Send this log wwhereever We want , may be to seq , but here We shall log to browser console and for localhost
   this.consoleLog(`${LogLevel[logType]}| ${category}| ${message}| ${getMetaData()}`);
  } catch (ex) {
   this.consoleLog("Error: Unable to Post SEQ Log", ex); // if failed to log then only log the error in browser console only for localhost
  }
 }
}

// Use this if  We want to generate the Logs  on cmd console and not on browser console
export class LoggingforBackendApps {
 public static Initialize() {
  /** Initialize the logger streams directly to the console and not any other destination. Should be called at application initialization time. */
  //should not use initialize and initializeToConsole together in an App
  Logger.initializeToConsole();
  Logger.setLevelDefault(LogLevel.Warning);
  Logger.setLevel("basic-viewport-app", LogLevel.Info);
  Logger.logInfo("basic-viewport-app", "Logger initialized...");
 }
}
