import { BehaviorBase } from "./behavior-base";
import { Client } from "discord.js";
import { Logger } from "@bot/logger";
import { Config } from "@bot/config";
import { ChangeLog } from "@bot/changelog";
import moment from "moment";
import { Injectable } from "injection-js";

/**
 * Initializes the system after login and starts the heartbeat.
 */
@Injectable()
export class HeartbeatBehavior extends BehaviorBase {
  private readonly NOW_PLAYING_MESSAGES = [
    () => `${this.changelog.version} - http://rollem.rocks`,
    () => `support on ko-fi - ${this.changelog.version} - http://rollem.rocks`,
    () => `${this.changelog.version} - http://rollem.rocks`,
    () => `support on patreon - ${this.changelog.version} - http://rollem.rocks`,
  ];

  constructor(
    private readonly config: Config,
    private readonly changelog: ChangeLog,
    client: Client,
    logger: Logger,
  ) { super(client, logger); }

  protected async register() {
    this.client.on('ready', async () => {
      this.logger.trackSimpleEvent("ready");

      console.log("will defer to: " + this.config.deferToClientIds);
      console.log('username: ' + this.client.user?.username);
      console.log('id: ' + this.client.user?.id);

      const shard = this.config.ShardId;
      if (shard === 0) {
        this.cycleMessage();
        setInterval(() => this.cycleMessage(), this.config.messageInterval);
      }

      const mentionRegex = '^<@!' + this.client.user?.id + '>\\s+';
      this.config.mentionRegex = new RegExp(mentionRegex);

      this.sendHeartbeat("startup message");
      this.sendHeartbeatNextHour();
    });
  }

  private cycleMessage() {
    if (this.client.user) {
      const messageFunc = this.NOW_PLAYING_MESSAGES.shift();
      if (!messageFunc) {
        throw new Error("No message found.");
      }

      this.NOW_PLAYING_MESSAGES.push(messageFunc);
      const message = messageFunc();
      this.client.user.setStatus("online").catch(error => this.handleRejection("setStatus", error));
      this.client.user
        .setActivity(message)
        .catch(error => this.handleRejection("setActivity", error));
    }
  }

  private sendHeartbeatNextHour() {
    const now = moment();
    const nextHour = moment().endOf('h');
    const msToNextHour = nextHour.diff(now);
    setTimeout(
      () => {
        this.sendHeartbeat("heartbeat at " + nextHour.toString());
        this.sendHeartbeatNextHour();
      },
      msToNextHour
    );
  }

  /** Sends a single heartbeat-info message to owner confirming liveliness. */
  private sendHeartbeat(reason: string) {
    const disableHeartbeat = process.env.DISABLE_HEARTBEAT
    if (disableHeartbeat) { return; }

    this.logger.trackSimpleEvent(`heartbeat - shard ${this.logger.shardName()}`, {reason: reason});
  }
}
