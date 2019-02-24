import { BehaviorBase } from "./behavior-base";

/**
 * Replies with "pong" whem DM'd "ping".
 */
export class PingPongBehavior extends BehaviorBase {
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