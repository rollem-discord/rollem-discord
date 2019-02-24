import { RollBehaviorBase } from "./roll-behavior-base";

/**
 * Parses things with the following prefixes:
 *  - The bot's name
 *  - &
 *  - r
 * 
 * Parses `[inline rolls]`
 */
export class ParseHardBehavior extends RollBehaviorBase {
  protected register() {
    // TODO: Split this up. Combine common bail rules.
    // inline and convenience messaging
    this.client.on('message', message => {
      // avoid doing insane things
      if (message.author.bot) { return; }
      if (message.author == this.client.user) { return; }
      if (this.shouldDefer(message)) { return; }

      var content = message.content.trim();

      // ignore the dice requirement with prefixed strings
      if (content.startsWith('r') || content.startsWith('&')) {
        var subMessage = content.substring(1);
        var result = this.parser.tryParse(subMessage);
        var response = this.buildMessage(result, false);
        if (response) {
          if (this.shouldDefer(message)) { return; }
          message.reply(response).catch(rejected => this.handleSendRejection(message));
          this.logger.trackEvent('medium parse');
          return;
        }
      }

      // ignore the dice requirement with name prefixed strings
      var match = content.match(this.config.mentionRegex); // TODO: This should override Deferral
      if (match) {
        var subMessage = content.substring(match[0].length);
        var result = this.parser.tryParse(subMessage);
        var response = this.buildMessage(result, false);
        if (response) {
          if (this.shouldDefer(message)) { return; }
          message.reply(response).catch(rejected => this.handleSendRejection(message));
          this.logger.trackEvent('hard parse');
          return;
        }
      }

      // handle inline matches
      let last: RegExpExecArray | null = null;
      var matches: string[] = [];
      var regex = /\[(.+?)\]/g;
      while (last = regex.exec(content)) { matches.push(last[1]); }

      if (matches && matches.length > 0) {
        var messages = matches.map(match => {
          var result = this.parser.tryParse(match);
          var response = this.buildMessage(result);
          return response;
        }).filter(x => !!x);

        if (messages.length === 0) { return; }

        var fullMessage = '\n' + messages.join('\n');
        if (fullMessage) {
          if (this.shouldDefer(message)) { return; }
          message.reply(fullMessage).catch(rejected => this.handleSendRejection(message));
          this.logger.trackEvent('inline parse');
          return;
        }
      }
    });
  }
}