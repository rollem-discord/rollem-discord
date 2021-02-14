import { OldContainer } from "./old-container";
import { ParamType } from "./param-type";

/** A singular value with no constraints. */
export class Value extends OldContainer {
  constructor(input: ParamType<Value>) {
    super(input);
  }

  public static fromNumber(input: number): Value {
    return new Value(
      {
        pretties: `${input}`,
        value: input,
        parentValues: [],
      });
  }
}