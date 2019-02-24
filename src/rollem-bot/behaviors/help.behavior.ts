import { BehaviorBase } from "./behavior-base";
import { Config } from "../config";
import { ChangeLog } from "../changelog";
import { Client } from "discord.js";
import { Logger } from "../logger";
import moment from "moment";

/**
 * Replies to "stats", "help", and "changelog"
 */
export class HelpBehavior extends BehaviorBase {
  constructor(
    private readonly config: Config,
    private readonly changelog: ChangeLog,
    client: Client,
    logger: Logger,
  ) { super(client, logger); }

  protected register() {
    this.client.on('message', message => {
      if (message.author.bot) { return; }
      let content = message.content;
    
      // ignore without prefix
      var match = content.match(this.config.mentionRegex);
      if (message.guild && !match) { return; }
      if (match) {
        content = content.substring(match[0].length).trim();
      }
    
      // stats and basic help
      if (content.startsWith('stats') || content.startsWith('help')) {
        let guilds = this.client.guilds.map((g) => g.name);
        let uptime = moment.duration(this.client.uptime);
        let stats = [
          '',
          `**shard:** ${this.logger.shardName()}`,
          `**uptime:** ${uptime.days()}d ${uptime.hours()}h ${uptime.minutes()}m ${uptime.seconds()}s`,
          `**servers:** ${this.client.guilds.size}`,
          `**users:** ${this.client.users.size}`,
          '',
          'Docs at <http://rollem.rocks>',
          'Try `@rollem changelog`',
          '',
          'Avatar by Kagura on Charisma Bonus.'
        ];
        let response = stats.join('\n');
        message.reply(stats).catch(rejected => this.handleSendRejection(message));
        this.logger.trackEvent("stats");
      }
    
      // changelog
      if (content.startsWith('changelog') ||
        content.startsWith('change log') ||
        content.startsWith('changes') ||
        content.startsWith('diff')) {
        message.reply(this.changelog.changelog).catch(rejected => this.handleSendRejection(message));
        this.logger.trackEvent("changelog");
      }
    });
  }
}