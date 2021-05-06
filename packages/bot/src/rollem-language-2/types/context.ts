import { Chance } from 'chance';

// tslint:disable: max-classes-per-file

export interface Context {
  chance: Chance.Chance;
  hello: string;
  trace(...values: any[]): void;
}

let counter = 0;

/** Adds one to the "random number" each time it's called. */
export class TestContext implements Context {
  public chance: Chance.Chance;
  public hello: string = "world";
  public callCount = 0;
  public contextId = counter++;
  public created = new Date();

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

  public trace(...values: any[]) {
    const hours = this.created.getHours().toString().padStart(2, '0');
    const minutes = this.created.getMinutes().toString().padStart(2, '0');
    const seconds = this.created.getSeconds().toString().padStart(2, '0');
    const millis = this.created.getMilliseconds().toString().padStart(3, '0');
    const stamp = `[${[hours, minutes, seconds].join(':')}.${millis}|${this.contextId.toString().padStart(3)}]`;
    console.log(stamp, ...values);
  }
}