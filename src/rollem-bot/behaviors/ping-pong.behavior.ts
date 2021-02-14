import { BehaviorBase } from "./behavior-base";
import { Client } from "discord.js";
import { Logger } from "@bot/logger";
import { Injectable } from "injection-js";

/**
 * Replies with "pong" when DM'd "ping".
 */
@Injectable()
export class PingPongBehavior extends BehaviorBase {
  constructor(
    protected readonly client: Client,
    protected readonly logger: Logger,
  ) { super(client, logger); }

  protected async register() {
    this.client.on('message', async message => {
      if (message.author.bot) { return; }
      if (message.author == this.client.user) { return; }
      if (message.guild) { return; }
    
      if (message.content === 'ping') {
        await message.reply('pong').catch(rejected => this.handleSendRejection(message));
      }
    });
  }
}