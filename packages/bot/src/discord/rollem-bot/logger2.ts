import * as client from 'prom-client';
import { Config } from './config';

const shardLabel = new Config().ShardLabel;
client.collectDefaultMetrics({ labels: { shard: shardLabel }});

/** Manages logging to prometheus. */
export class Logger2 {
  private readonly client = client;
}