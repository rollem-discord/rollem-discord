import { BehaviorBase } from "./behavior-base";
import util from "util";

// TODO: there's got to be a cleaner way to handle this, but this seems to make it more resilient.

/**
 * Causes this client to die when a disconnect event occurs.
 * When supervised, the process should be immediately restarted.
 */
export class DieOnDisconnectBehavior extends BehaviorBase {
  protected register() {
    this.client.on('disconnect', (f) => {
      this.logger.trackEvent("disconnect", { reason: util.inspect(f) });
      this.logger.flush();
      process.exit(1);
    });
  }
}