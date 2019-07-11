import { BehaviorBase } from "./behavior-base";
import util, { promisify } from "util";
import { Client, Message, User, MessageReaction } from "discord.js";
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
    // this.client.on("debug", function(info){
    //     console.log(`debug -> ${info}`);
    // });
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
    this.client.on('rateLimit', info => {
      if (info && typeof info.path == 'string' && info.path.includes('reactions')) {
        return;
      }
      
      this.logger.trackEvent('RateLimit', info)
    });

    this.initializeSelfWatchdog();

    setInterval(() => this.watch(), DeadmanSwitchBehavior.PollingDuration);
  }

  /** Generates messages on startup and then twiddles the emoji on them, ensuring there's always activity. */
  private initializeSelfWatchdog() {
    let botOwner: User | undefined = undefined;
    let message: Message | undefined = undefined;
    let reaction: MessageReaction | undefined = undefined;
    let counter = 0;
    this.client.on('ready', async () => {
      message = undefined;
      reaction = undefined;
      counter++;
      while (!message) {
        try {
          botOwner = await this.client.fetchUser("105641015943135232"); // this is me. i couldn't message the bot itself.
          message = await botOwner.send(`shard '${this.logger.shardName()}' - ready ${counter}`) as Message;
        } catch {
          await promisify(setTimeout)(DeadmanSwitchBehavior.TimeWindowDuration / 3);
        }
      }
    });

    setInterval(async () => {
      try {
        if (!message) { return; }
        
        if (!reaction) {
          reaction = await message.react("🕒");
        } else {
          await reaction.remove();
          reaction = undefined;
        }
      } catch { /* oblivion */ }
    }, DeadmanSwitchBehavior.TimeWindowDuration / 2);
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
      this.logger.flush();
      process.exit(0);
    }

    this.messagesSinceLastReport = 0;
  }
}