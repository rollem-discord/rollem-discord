import { Client } from "discord.js";
import { Logger } from "../logger";
import util from "util";

export abstract class BehaviorBase {
  constructor(
    protected readonly client: Client,
    protected readonly logger: Logger,
  ) { }
  
  /** Applies the behavior to the given client. */
  public apply(): void {
    this.logger.trackEvent(`Registering Behavior: ${this.constructor.name}`)
    this.register();
  }

  protected abstract register(): void;

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
    this.logger.trackEvent("Missing send permission");
  }
}