import { Chance } from 'chance';

// tslint:disable: max-classes-per-file

export interface Context {
  chance: Chance.Chance;
  hello: string;
}

/** Adds one to the "random number" each time it's called. */
export class TestContext implements Context {
  public chance: Chance.Chance;
  public hello: string = "world";
  public callCount = 0;

  constructor(
    seed: Chance.Seed,
  ) {
    const internalChance = new Chance(seed);
    this.chance = new Chance(() => {
      this.callCount++;
      const random = (internalChance as any).random();
      return random;
    });
  }
}