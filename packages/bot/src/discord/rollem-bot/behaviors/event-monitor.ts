import { DiscordBehaviorBase } from "./discord-behavior-base";
import util, { promisify } from "util";
import { Client, Message, User, MessageReaction } from "discord.js";
import { Logger, LoggerCategory } from "@bot/logger";
import { Injectable } from "injection-js";
import { PromLogger } from "@bot/prom-logger";

// TODO: there's got to be a cleaner way to handle this, but this seems to make it more resilient.

/**
 * Counts seen events with PromLogger.
 */
@Injectable()
export class EventMonitorBehavior extends DiscordBehaviorBase {
  constructor(
    client: Client,
    promLogger: PromLogger,
    logger: Logger,
  ) { super(client, promLogger, logger); }

  protected async register() {
    this.client.on('messageCreate', m => {
      this.logDiscordActivity('messageCreate');
    });

    this.client.on('typingStart', () => this.logDiscordActivity('typingStart'));
    // this.client.on('typingStop', () => this.logDiscordActivity());
    this.client.on('presenceUpdate', () => this.logDiscordActivity('presenceUpdate'));
    this.client.on('userUpdate', () => this.logDiscordActivity('userUpdate'));
    // this.client.on("debug", function(info){
    //     console.log(`debug -> ${info}`);
    // });
    this.client.on('messageReactionAdd', (reaction, user) => this.logDiscordActivity('messageReactionAdd'));
    this.client.on('messageReactionRemove', (reaction, user) => this.logDiscordActivity('messageReactionRemove'));
    this.client.on('messageReactionRemoveAll', (message) => this.logDiscordActivity('messageReactionRemoveAll'));
    this.client.on('messageUpdate', (oldMessage, newMessage) => this.logDiscordActivity('messageUpdate'));
    this.client.on('guildUnavailable', guild => {
      this.logger.trackError(LoggerCategory.SystemEvent, `Guild Unvailable (id: ${guild.id})`);
      this.logDiscordActivity('guildUnavailable');
    });
    this.client.on('voiceStateUpdate', (oldMember, newMember) => this.logDiscordActivity('voiceStateUpdate'));

    this.client.on('warn', info => {
      this.logger.trackError(LoggerCategory.SystemEvent, "warning - " + info);
      this.logDiscordActivity('warn');
    });
    this.client.on('rateLimit', info => {
      if (info && typeof info.path == 'string' && info.path.includes('reactions')) {
        return;
      }
      this.logDiscordActivity('rateLimit');
      this.logger.trackSimpleEvent(LoggerCategory.SystemEvent, 'RateLimit', info)
    });
  }

  private logDiscordActivity(activity: string) {
    this.promLogger.incEventsProcessed(activity);
  }
}