import { expect } from 'chai';
import 'mocha';
import { Storage } from './storage';

describe('storage', () => {
  it('should retrieve user', async () => {
    const storage = new Storage();
    await storage.initialize();
    const user = await storage.getOrCreateUser('105641015943135232');
  });
});