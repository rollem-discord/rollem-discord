import { BehaviorBase } from "./behavior-base";
import util, { promisify } from "util";
import { Client, Message, User } from "discord.js";
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
    this.client.on("debug", function(info){
        console.log(`debug -> ${info}`);
    });
    this.client.on('messageReactionAdd', (reaction, user) => this.logDiscordActivity());
    this.client.on('messageReactionRemove', (reaction, user) => this.logDiscordActivity());
    this.client.on('messageReactionRemoveAll', (message) => this.logDiscordActivity());
    this.client.on('messageUpdate', (oldMessage, newMessage) => this.logDiscordActivity());
    this.client.on('guildUnavailable', guild => {
      this.logger.trackError(`Guild Unvailable (id: ${guild.id})`);
      this.logDiscordActivity();
    });
    this.client.on('voiceStateUpdate', (oldMember, newMember) => this.logDiscordActivity());

    this.client.on('warn', info => this.logger.trackError("warning - " + info));
    this.client.on('rateLimit', info => this.logger.trackEvent('RateLimit', info));

    this.client.on('message', m => {
      if (m.content == 'throw error') throw new Error('error');
      if (m.content == 'throw') throw 'rip'
      if (m.content == 'die') process.exit(4);
    })

    this.client.on('ready', async () => {
      let botOwner: User | undefined = undefined;
      let message: Message | undefined = undefined;
      while (!message) {
        try {
          botOwner = this.client.users.find("id", "105641015943135232"); // this is me. i couldn't message the bot itself.
          message = await botOwner.send(`shard '${this.logger.shardName()}' - ready`) as Message;
        } catch {
          await promisify(setTimeout)(DeadmanSwitchBehavior.TimeWindowDuration / 3);
        }
      }
      while (true) {
        try {
          let reaction = await message.react("🕒");
          await promisify(setTimeout)(DeadmanSwitchBehavior.TimeWindowDuration / 3);
          await reaction.remove();
          await promisify(setTimeout)(DeadmanSwitchBehavior.TimeWindowDuration / 3);
        } catch { /* oblivion */ }
      }
    });

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