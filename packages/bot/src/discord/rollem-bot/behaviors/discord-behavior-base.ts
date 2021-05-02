import { Client } from "discord.js";
import { Logger } from "@bot/logger";
import { Injectable } from "injection-js";

/** A base for behaviors to be applied to a discord client. */
@Injectable()
export abstract class DiscordBehaviorBase {
  constructor(
    protected readonly client: Client,
    protected readonly logger: Logger,
  ) { }
  
  /** Applies the behavior to the given client. */
  public async apply(): Promise<void> {
    this.logger.trackSimpleEvent(`Registering Behavior: ${this.constructor.name}`)
    await this.register();
  }

  /** Called on initialization to register any callbacks with the discord client. */
  protected abstract register(): Promise<void>;

  /** Handle an unknown rejection. */
  protected handleRejection(label: string, error: Error) {
    // let guildId = message.guild ? message.guild.id : null;
    // let channelId = message.channel ? message.channel.id : null;
    // let messageId = message.id;
    // let userId = message.userId;
    this.logger.trackError(label, error);
  }
  
  /** Handle a rejected send request. */
  protected handleSendRejection(message) {
    // let guildId = message.guild ? message.guild.id : null;
    // let channelId = message.channel ? message.channel.id : null;
    // let messageId = message.id;
    // let userId = message.userId;
    this.logger.trackMessageEvent("Missing send permission", message);
  }
}