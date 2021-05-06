import { Dice } from "./dice";
import { ParamType } from "./param-type";
import { Value } from "./value";

export class DicePassthru extends Dice {
  public readonly $howMany: Value;
  public readonly $dieSize: Value;

  constructor(input: ParamType<DicePassthru>) {
    super(input);
    this.$howMany = input.$howMany;
    this.$dieSize = input.$dieSize;
  }

  public get dice() {
    return this.dicePassthru;
  }
}