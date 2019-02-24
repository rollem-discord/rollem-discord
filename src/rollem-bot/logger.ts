// enable application insights if we have an instrumentation key set up
import * as appInsights from "applicationinsights";
import { Client } from "discord.js";
import { Config } from "./config";
import { ChangeLog } from "./changelog";
import { injectable } from "inversify";
import util from "util";

/** Manages logging. */
@injectable()
export class Logger {
  private readonly aiClient: appInsights.TelemetryClient;

  constructor(
    /** The associated config. */
    public config: Config,

    /** The client this logger is for. */
    public client?: Client,

    /** The associated changelog. */
    public changelog?: ChangeLog,
  ) {
    if (config.AppInsightsInstrumentationKey) {
      // TODO: This reads all log messages from console. We can probably do better by logging via winston/bunyan.
      appInsights.setup()
          .setAutoDependencyCorrelation(true)
          .setAutoCollectRequests(true)
          .setAutoCollectPerformance(true)
          .setAutoCollectExceptions(true)
          .setAutoCollectDependencies(true)
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
  public trackEvent(name: string, properties = {}) {
    if (this.aiClient) {
      this.aiClient.trackEvent({
        name: name,
        measurements: this.enrichAIMetrics(),
        properties: this.enrichAIProperties(properties)
      });
    }

    console.log(name, properties);
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
  public trackError(name: string, error?: Error) {
    if (this.aiClient) {
      error = error || new Error(name);
      this.aiClient.trackException({
        exception: error,
        properties: {
          error: util.inspect(error),
          label: name,
        }
      })
    }

    console.log(name, JSON.stringify(error));
  }

  /** Flushes the logger's pending messages. */
  public flush(): any {
    if (this.aiClient) { this.aiClient.flush(); }
  }

  /** Constructs a human-readable string identifying this shard. */
  public shardName() {
    if (!this.client) { return undefined; }
    return this.client.shard
      ? `${this.client.shard.id+1} of ${this.client.shard.count}`
      : "only";
  }

  /** Constructs a one-index string identifying this shard. */
  public shardId() {
    if (!this.client) { return undefined; }
    return this.client.shard
      ? this.client.shard.id + 1
      : 1;
  }

  /** Safely retrieves the shard count. */
  public shardCount() {
    if (!this.client) { return undefined; }
    return this.client.shard
      ? this.client.shard.count
      : 1;
  }

  /** Adds common AI properties to the given object (or creates one). Returns the given object. */
  private enrichAIProperties(object = {}) {
    if (this.client) {
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
  private enrichAIMetrics(object = {}) {
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