import * as client from 'prom-client';

client.collectDefaultMetrics();

/** Manages logging to prometheus. */
export class Logger2 {
  private readonly client = client;
}