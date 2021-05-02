import { Injectable } from "injection-js";

/** Loads and stores various configuration values. */
@Injectable()
export class Config {
  /** The ID of this shard. Must be below @see ShardCount. */
  public readonly ShardId = process.env.DISCORD_BOT_SHARD_ID ? +process.env.DISCORD_BOT_SHARD_ID : undefined;

  /** The number of shards. */
  public readonly ShardCount = process.env.DISCORD_BOT_SHARD_COUNT ? +process.env.DISCORD_BOT_SHARD_COUNT : undefined;

  /** True if the config has all needed shard info. */
  public readonly HasShardInfo = this.ShardId != undefined && this.ShardCount != undefined;

  /** The user token for Discord. */
  public readonly Token = process.env.DISCORD_BOT_USER_TOKEN;

  /** The client IDs to defer to. If any of these clients are present in a channel, do not respond. */
  public readonly deferToClientIds = (process.env.DEFER_TO_CLIENT_IDS || '').split(',');

  /** The AI Instrumentation Key. */
  public readonly AppInsightsInstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;

  /** The regex to be used to determine if the bot was mentioned. Updated after login. <@!...> means the message was tab-completed, <@...> means it was typed manually and inferred. */
  public mentionRegex: RegExp = /$<@!999999999999999999>|<@999999999999999999>/i;

  /** The interval between updating the "Now Playing" message under the bot. */
  public readonly messageInterval = 59 * 1000; // every minute (less a bit, so it will trigger other "every minute" monitors)
}