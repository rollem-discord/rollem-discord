import _ from "lodash";
import { OldContainer } from "./old-container";
import { ParamType } from "./param-type";

/** A multi-value container with no constraints and no extras. */
export class Values extends OldContainer {
  public readonly values: number[];

  constructor(input: ParamType<Values>) {
    super(input);
    this.values = input.values;
  }

  public depth(): number {
    return Math.max(0, ...this.parentValues.map(parent => parent.depth())) + 1;
  }

  public dice(): number {
    return this.dicePassthru();
  }

  public static fromNumbers(inputs: number[]): Values {
    return new Values(
      {
        pretties: `[${inputs.join(", ")}]`,
        value: _.sum(inputs),
        values: inputs,
        parentValues: [],
      });
  }
}