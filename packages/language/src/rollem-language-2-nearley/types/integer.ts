import { OldContainer } from "./old-container";
import { ParamType } from "./param-type";
import { Value } from "./value";

/** A singluar integer value. */
export class Integer extends Value {
  constructor(input: ParamType<Integer>) {
    super(input);
  }

  public static fromNumber(input: number): Integer {
    const decimal = input - Math.floor(input);
    if (decimal > 0)
      throw `Cannot create integer with number ${input}`;

    return new Integer(
      {
        pretties: `${input}`,
        value: input,
        parentValues: [],
      });
  }
}