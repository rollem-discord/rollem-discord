import { Logger } from "@bot/logger";
import { BehaviorStatsBase, BotStats } from "@common/stats-base";
import { Client } from "discord.js";
import { Injectable } from "injection-js";
import moment from "moment";

/** Produces stats for display with the discord bot. */
@Injectable()
export class DiscordStats extends BehaviorStatsBase {
  constructor(
    private readonly logger: Logger,
    private readonly client: Client,
  ) {
    super();
  }

  public async getStats(): Promise<BotStats> {
    const uptime = moment.duration(this.client.uptime);

    return {
      shard: this.logger.shardName(),
      uptime: `${uptime.days()}d ${uptime.hours()}h ${uptime.minutes()}m ${uptime.seconds()}s`,
      servers: `${this.client.guilds.cache.size}`,
      users: `${this.client.users.cache.size}`,
    }
  }

}