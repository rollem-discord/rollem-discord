import express from 'express';
import * as client from 'prom-client';
import { Config } from './config';

const app = express();
const port = 8081;

// standard prometheus metrics
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.get('/', async (req, res) => {
  try {
    const config = new Config();
    res.status(200).end(JSON.stringify({
      time: new Date().toISOString(),
      shard: config.ShardLabel,
    }, null, '  '));
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}.`);
});

/** The express app. */
export class App {
  private readonly app = app;
}