import { Injectable } from "injection-js";

/** Loads and stores various configuration values. */
@Injectable()
export class Config {
  /** The ID of this shard. Must be below @see ShardCount. */
  public readonly ShardId = process.env.DISCORD_BOT_SHARD_ID ? +process.env.DISCORD_BOT_SHARD_ID : undefined;

  /** The number of shards. */
  public readonly ShardCount = process.env.DISCORD_BOT_SHARD_COUNT ? +process.env.DISCORD_BOT_SHARD_COUNT : undefined;

  /** The user token for Discord. */
  public readonly Token = process.env.DISCORD_BOT_USER_TOKEN;

  /** The client IDs to defer to. If any of these clients are present in a channel, do not respond. */
  public readonly deferToClientIds = (process.env.DEFER_TO_CLIENT_IDS || '').split(',');

  /** The AI Instrumentation Key. */
  public readonly AppInsightsInstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;

  /** The regex to be used to determine if the bot was mentioned. Updated after login. */
  public mentionRegex: RegExp = /$<@999999999999999999>/i;

  /** The interval between updating the "Now Playing" message under the bot. */
  public readonly messageInterval = 60 * 1000; // every minute
}