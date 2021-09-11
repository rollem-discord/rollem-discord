import * as client from 'prom-client';

client.collectDefaultMetrics({ prefix: 'rollem_' });

/** Manages logging to prometheus. */
export class Logger2 {
  private readonly client = client;
}