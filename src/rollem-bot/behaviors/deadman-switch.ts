import { BehaviorBase } from "./behavior-base";
import util from "util";
import { Client } from "discord.js";
import { Logger } from "@bot/logger";
import { Injectable } from "injection-js";

// TODO: there's got to be a cleaner way to handle this, but this seems to make it more resilient.

/**
 * Causes this client to die when a disconnect event occurs.
 * When supervised, the process should be immediately restarted.
 */
@Injectable()
export class DeadmanSwitchBehavior extends BehaviorBase {
  private static readonly TimeWindowDuration = 60 * 1000;
  private static readonly PollingDuration = 30 * 1000;

  constructor(
    protected readonly client: Client,
    protected readonly logger: Logger,
  ) { super(client, logger); }

  private messagesInLastMinute = 0;
  private messagesSinceLastReport = 0;

  protected register() {
    this.client.on('message', m => {
      this.messagesInLastMinute++;
      this.messagesSinceLastReport++;
      setTimeout(() => this.messagesInLastMinute--, DeadmanSwitchBehavior.TimeWindowDuration);
    });

    this.client.on('message', m => {
      if (m.content == 'throw error') throw new Error('error');
      if (m.content == 'throw') throw 'rip'
      if (m.content == 'die') process.exit(4);
    })

    setInterval(() => this.watch(), DeadmanSwitchBehavior.PollingDuration);
  }

  private watch() {
    this.logger.trackMetric("Handled Messages Per Minute", this.messagesInLastMinute);
    this.logger.trackMetric("Handled Messages", this.messagesSinceLastReport);
    if (this.messagesInLastMinute == 0) {
      this.logger.trackMetric("No Messages Received", 1);
      this.logger.trackError("No messages received in a minute. Restarting.");
      process.exit(3);
    }

    this.messagesSinceLastReport = 0;
  }
}