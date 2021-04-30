import { BehaviorBase } from "./behavior-base";
import { Config } from "@bot/config";
import { ChangeLog } from "@bot/changelog";
import { Client } from "discord.js";
import { Logger } from "@bot/logger";
import moment from "moment";
import { Injectable } from "injection-js";
import util from 'util';

/**
 * Replies to "stats", "help", and "changelog"
 */
@Injectable()
export class HelpBehavior extends BehaviorBase {
  constructor(
    private readonly config: Config,
    private readonly changelog: ChangeLog,
    client: Client,
    logger: Logger,
  ) { super(client, logger); }

  protected async register() {
    this.client.on('message', async message => {
      if (message.author.bot) { return; }
      let content = message.content;

      // ignore without prefix
      const match = content.match(this.config.mentionRegex);
      if (message.guild && !match) { return; }
      if (match) {
        content = content.substring(match[0].length).trim();
      }

      // stats and basic help
      if (content.startsWith('stats') || content.startsWith('help')) {
        const guilds = this.client.guilds.cache.map((g) => g.name);
        const uptime = moment.duration(this.client.uptime);
        const stats = [
          '',
          `**shard:** ${this.logger.shardName()}`,
          `**uptime:** ${uptime.days()}d ${uptime.hours()}h ${uptime.minutes()}m ${uptime.seconds()}s`,
          `**servers:** ${this.client.guilds.cache.size}`,
          `**users:** ${this.client.users.cache.size}`,
          '',
          '- Docs at <http://rollem.rocks>',
          '- Try `@rollem changelog`',
          '- v2 syntax is in the works',
          '',
          "Fund rollem's server addiction:",
          '- <https://patreon.com/david_does>',
          '- <https://ko-fi.com/rollem>',
          '',
          'Avatar by Kagura on Charisma Bonus.'
        ];
        const response = stats.join('\n');
        message.reply(stats).catch(rejected => this.handleSendRejection(message));
        this.logger.trackMessageEvent("stats", message);
      }

      // changelog
      if (content.startsWith('changelog') ||
        content.startsWith('change log') ||
        content.startsWith('changes') ||
        content.startsWith('diff')) {
        await message.reply(this.changelog.changelog).catch(rejected => this.handleSendRejection(message));
        this.logger.trackMessageEvent("changelog", message);
      }
    });
  }
}