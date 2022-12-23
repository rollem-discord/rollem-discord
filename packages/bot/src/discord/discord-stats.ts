import { Logger } from "@bot/logger";
import { PromLogger } from "@bot/prom-logger";
import { BehaviorStatsBase, BotStats } from "@common/stats-base";
import { Client } from "discord.js";
import { Injectable } from "injection-js";
import moment from "moment";
import { Gauge } from "prom-client";

export interface DiscordRawBotStats {
  shard?: string,
  uptime: moment.Duration;
  servers: number;
  users: number;
}

/** Produces stats for display with the discord bot. */
@Injectable()
export class DiscordStats extends BehaviorStatsBase {
  private readonly serversCountGauge: Gauge;
  private readonly usersCountGauge: Gauge;

  constructor(
    private readonly logger: Logger,
    private readonly promLogger: PromLogger,
    private readonly client: Client,
  ) {
    super();
    const self = this;

    this.serversCountGauge = new promLogger.client.Gauge({
      name: 'servers',
      help: 'The number of known-servers on this shard.',
      async collect() {
        if (self.client.isReady()) {
          console.log("servers collected");
          const stats = await self.getRawStats();
          this.set(stats.servers)
        }
      }
    });

    this.usersCountGauge = new promLogger.client.Gauge({
      name: 'users',
      help: 'The number of known-users on this shard.',
      async collect() {
        if (self.client.isReady()) {
          console.log("users collected");
          const stats = await self.getRawStats();
          this.set(stats.users)
        }
      }
    });
  }

  public async getRawStats(): Promise<DiscordRawBotStats> {
    const uptime = moment.duration(this.client.uptime);

    return {
      shard: this.logger.shardName(),
      uptime,
      servers: this.client.guilds.cache.size,
      users: this.client.users.cache.size,
    }
  }

  public async getStats(): Promise<BotStats<keyof DiscordRawBotStats>> {
    const stats = await this.getRawStats();

    return {
      shard: stats.shard?.toString() ?? 'unknown',
      uptime: `${stats.uptime.days()}d ${stats.uptime.hours()}h ${stats.uptime.minutes()}m ${stats.uptime.seconds()}s`,
      servers: `${stats.servers}`,
      users: `${stats.users}`,
    }
  }

}