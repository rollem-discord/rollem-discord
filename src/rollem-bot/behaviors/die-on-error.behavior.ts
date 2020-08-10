import { BehaviorBase } from "./behavior-base";
import util from "util";
import { Client } from "discord.js";
import { Logger } from "@bot/logger";
import { Injectable } from "injection-js";

// TODO: there's got to be a cleaner way to handle this, but this seems to make it more resilient.

/**
 * Causes this client to die when an unknown error occurs.
 * When supervised, the process should be immediately restarted.
 */
@Injectable()
export class DieOnErrorBehavior extends BehaviorBase {
  constructor(
    protected readonly client: Client,
    protected readonly logger: Logger,
  ) { super(client, logger); }
  
  protected register() {
    this.client.on('error', error => this.handleClientError(error));
    process.on("exit", code => this.handleExit(code));
    process.on("uncaughtException", error => this.handleUncaughtError(error));
    process.on("unhandledRejection", (reason, promise) => this.handleUnhandledRejection(reason, promise));
  }

  /** Handles errors emitted by the client. */
  private handleClientError(error: Error) {
    if (error && typeof(error.message) === "string") {
      try {
        let ignoreError = error.message.includes('write EPIPE');
        if (ignoreError) {
          this.logger.trackSimpleEvent("known error - " + error.message, { reason: util.inspect(error)});
          return;
        }
      } catch { }
    }
  
    this.logger.trackSimpleEvent("unknown error", { reason: util.inspect(error) });
    this.logger.flush();
  
    process.exit(0);
  }

  /** Handles otherwise-unhandled errors. */
  private handleUncaughtError(error: Error) {
    this.logger.trackError(`uncaught error - ${error.name}`, error);
    this.logger.flush();
    process.exit(0);
  }

  /** Handles otherwise-unhandled errors. */
  private handleUnhandledRejection(reason: {} | null | undefined, promise: Promise<any>) {
    if (reason instanceof Error)
      this.logger.trackError(`unhandled rejection - ${reason}`, reason);
    this.logger.trackError(`unhandled rejection - ${reason} - ${util.inspect(reason)}`);

    this.logger.flush();
  }

  
  /** Fired on exit. */
  private handleExit(code: number) {
    this.logger.trackSimpleEvent(`exiting - ${code}`);
    this.logger.flush();
  }
}