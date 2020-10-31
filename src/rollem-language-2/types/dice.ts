import { OldContainer } from "./old-container";
import { ParamType } from "./param-type";
import { Value } from "./value";
import { Values } from "./values";

export class Dice extends Values {
  public readonly $howMany: Value;
  public readonly $dieSize: Value;

  constructor(input: ParamType<Dice>) {
    super(input);
    this.$howMany = input.$howMany;
    this.$dieSize = input.$dieSize;
  }
}