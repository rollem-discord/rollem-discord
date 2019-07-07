import { BehaviorBase } from "./behavior-base";
import { Client } from "discord.js";
import { Logger } from "@bot/logger";
import { Injectable } from "injection-js";

/**
 * Replies with "pong" whem DM'd "ping".
 */
@Injectable()
export class PingPongBehavior extends BehaviorBase {
  constructor(
    protected readonly client: Client,
    protected readonly logger: Logger,
  ) { super(client, logger); }

  protected register() {
    this.client.on('message', message => {
      if (message.author.bot) { return; }
      if (message.author == this.client.user) { return; }
      if (message.guild) { return; }
    
      if (message.content === 'ping') {
        message.reply('pong').catch(rejected => this.handleSendRejection(message));
      }
    });
  }
}