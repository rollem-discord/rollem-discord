import { OldContainer } from "./old-container";
import { Delayed } from "./types";

export function makeInteger(text: string): Delayed<OldContainer> {
  const v = parseInt(text, 10);
  return () => new OldContainer({
    value: v,
    values: [ v ],
    pretties: text,
    depth: 1,
    dice: 0
  });
}

// export interface Context {
//   hello: string;
// }

// export type Delayed<T> = (context: Context) => T;

// export function simpleInt(text: string): Delayed<number> {
//   const v = parseInt(text, 10);
//   return (context: Context) => v * context.hello.length;
// }

// export function simpleAdd(a: Delayed<number>, b: Delayed<number>): Delayed<number> {
//   return (context: Context) => a(context) + b(context);
// }

// const soonToBeValue: Delayed<number> = simpleAdd(simpleInt("1"), simpleInt("2"))
// const value1: number = soonToBeValue({hello: "world"});
// assert(value1 === 15);
// const value2: number = soonToBeValue({hello: "tenletters"});
// assert(value2 === 30);

