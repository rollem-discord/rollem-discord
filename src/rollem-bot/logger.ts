// enable application insights if we have an instrumentation key set up
import * as appInsights from "applicationinsights";
import { Client, Message } from "discord.js";
import { Config } from "./config";
import { ChangeLog } from "./changelog";
import util from "util";
import { Injectable } from "injection-js";

/** Manages logging. */
@Injectable()
export class Logger {
  private readonly aiClient: appInsights.TelemetryClient;

  /** The client this logger is for. */
  public client?: Client;

  /** The associated changelog. */
  public changelog?: ChangeLog;

  constructor(
    /** The associated config. */
    public config: Config,
  ) {
    if (config.AppInsightsInstrumentationKey) {
      // TODO: This reads all log messages from console. We can probably do better by logging via winston/bunyan.
      appInsights.setup()
          .setAutoDependencyCorrelation(true)
          .setAutoCollectRequests(true)
          .setAutoCollectPerformance(true)
          .setAutoCollectExceptions(true)
          .setAutoCollectDependencies(false)
          .setAutoCollectConsole(true, true)
          .setUseDiskRetryCaching(true)
          .start();
    }

    // Will be `undefined` unless appInsights successfully initialized.
    this.aiClient = appInsights.defaultClient;

    // this.aiClient.addTelemetryProcessor((envelope, context) => {
    //   envelope.data.
    //   return true;
    // });
  }

  /** Tracks an event with AI using a console fallback. */
  // TODO: Convert many of the operations to use trackRequest instead. See https://docs.microsoft.com/en-us/azure/application-insights/app-insights-api-custom-events-metrics#trackrequest
  public trackSimpleEvent(name: string, properties = {}) {
    if (this.aiClient) {
      console.log(name, properties);
      this.aiClient.trackEvent({
        name: name,
        measurements: this.enrichAIMetrics(null),
        properties: this.enrichAIProperties(null, properties)
      });
    } else {
      console.log(name, properties);
    }
  }

  /** Tracks an event with AI using a console fallback. */
  // TODO: Convert many of the operations to use trackRequest instead. See https://docs.microsoft.com/en-us/azure/application-insights/app-insights-api-custom-events-metrics#trackrequest
  public trackMessageEvent(name: string, message: Message, properties = {}) {
    if (this.aiClient) {
      console.log(name, message, properties);
      this.aiClient.trackEvent({
        name: name,
        measurements: this.enrichAIMetrics(message),
        properties: this.enrichAIProperties(message, properties)
      });
    } else {
      console.log(name, message, properties);
    }
  }

  /** Tracks a metric with AI using a console fallback. */
  public trackMetric(name: string, value: number) {
    if (this.aiClient) {
      this.aiClient.trackMetric({
        name: name,
        value: value
      });
    } else {
      // oblivion
    }
  }

  /** Tracks an error with AI using a console fallback. */
  public trackMessageError(name: string, message: Message, error?: Error) {
    if (this.aiClient) {
      console.error(name, message, JSON.stringify(error));
      error = error || new Error(name);
      this.aiClient.trackException({
        exception: error,
        properties: {
          error: util.inspect(error),
          "Message ID": '' + (message?.id ?? ''),
          label: name,
        }
      })
    } else {
      console.error(name, message, JSON.stringify(error));
    }
  }

  /** Tracks an error with AI using a console fallback. */
  public trackError(name: string, error?: Error) {
    if (this.aiClient) {
      console.error(name, JSON.stringify(error));
      error = error || new Error(name);
      this.aiClient.trackException({
        exception: error,
        properties: {
          error: util.inspect(error),
          label: name,
        }
      })
    } else {
      console.error(name, JSON.stringify(error));
    }
  }

  /** Flushes the logger's pending messages. */
  public flush(): any {
    if (this.aiClient) { this.aiClient.flush(); }
  }

  /** Constructs a borg-readable string identifying this shard. Like "7 of 9" */
  public shardName() {
    if (!this.client) { return undefined; }

    var shardId = this.shardId();
    var shardCount = this.shardCount();
    
    if (typeof shardCount == "undefined") { return undefined; }
    if (shardCount > 1) { return `${shardId} of ${shardCount}`; }

    return "only";
  }

  /** Constructs a one-index string identifying this shard. */
  public shardId() {
    if (!this.client) { return undefined; }
    if (this.client.shard) { return this.client.shard.id + 1; }
    if (this.config.HasShardInfo && typeof this.config.ShardId == "number") {
      return this.config.ShardId + 1;
    }

    return 1;
  }

  /** Safely retrieves the shard count. */
  public shardCount() {
    if (!this.client) { return undefined; }
    if (this.client.shard) { return this.client.shard.count; }
    if (this.config.HasShardInfo) {
      return this.config.ShardCount;
    }
    
    return 1;
  }

  /** Adds common AI properties to the given object (or creates one). Returns the given object. */
  private enrichAIProperties(message: Message|null, object = {}) {
    if (this.client && this.client.user) {
      object['Guild ID'] = '' + (message?.guild?.id ?? 'none');
      object['Author ID'] = '' + (message?.author?.id ?? 'none');
      object['Channel ID'] = '' + (message?.channel?.id ?? 'none');
      object["Message ID"] = '' + (message?.id ?? '');
      object["Shard Name"] = '' + this.shardName();
      object["Client ID"] = '' + this.client.user.id;
      object["Client Name"] = '' + this.client.user.username;
    }
    
    if (this.changelog) {
      object["Version"] = '' + this.changelog.version;
    }

    return object;
  }

  /** Adds common AI metrics to the given object (or creates one). Returns the given object. */
  private enrichAIMetrics(message: Message|null, object = {}) {
    if (this.client) {
      object['Servers (per shard)'] = this.client.guilds.size;
      object['Users (per shard)'] = this.client.users.size;
      object['Uptime (minutes)'] = this.client.uptime / 1000 / 60;
      object['Shard Count'] = this.shardCount();
      object['Shard ID'] = this.shardId();
    }

    return object;
  }
}