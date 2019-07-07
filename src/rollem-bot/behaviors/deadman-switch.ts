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

  private activityInLastMinute = 0;
  private messagesSinceLastReport = 0;

  protected register() {
    this.client.on('message', m => {
      this.messagesSinceLastReport++;
      this.logDiscordActivity();
    });

    this.client.on('typingStart', () => this.logDiscordActivity());
    this.client.on('typingStop', () => this.logDiscordActivity());
    this.client.on('presenceUpdate', () => this.logDiscordActivity());
    this.client.on('userUpdate', () => this.logDiscordActivity());

    this.client.on('message', m => {
      if (m.content == 'throw error') throw new Error('error');
      if (m.content == 'throw') throw 'rip'
      if (m.content == 'die') process.exit(4);
    })

    setInterval(() => this.watch(), DeadmanSwitchBehavior.PollingDuration);
  }

  private logDiscordActivity() {
    this.activityInLastMinute++;
    setTimeout(() => this.activityInLastMinute--, DeadmanSwitchBehavior.TimeWindowDuration);
  }

  private watch() {
    this.logger.trackMetric("Activity Per Minute", this.activityInLastMinute);
    this.logger.trackMetric("Handled Messages", this.messagesSinceLastReport);
    if (this.activityInLastMinute == 0) {
      this.logger.trackMetric("No Activity", 1);
      this.logger.trackError("No activity in a minute. Restarting.");
      process.exit(3);
    }

    this.messagesSinceLastReport = 0;
  }
}