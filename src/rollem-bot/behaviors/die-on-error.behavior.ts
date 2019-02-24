import { BehaviorBase } from "./behavior-base";
import util from "util";

// TODO: there's got to be a cleaner way to handle this, but this seems to make it more resilient.

/**
 * Causes this client to die when an unknown error occurs.
 * When supervised, the process should be immediately restarted.
 */
export class DieOnErrorBehavior extends BehaviorBase {
  protected register() {
    this.client.on('error', (error) => {
      if (error && typeof(error.message) === "string") {
        try {
          let ignoreError = error.message.includes('write EPIPE');
          if (ignoreError) {
            this.logger.trackEvent("known error - " + error.message, { reason: util.inspect(error)});
            return;
          }
        } catch { }
      }
    
      this.logger.trackEvent("unknown error", { reason: util.inspect(error) });
      this.logger.flush();
    
      process.exit(1);
    });
  }
}