import { Delayed, Dice, Integer, Values } from "@language-v2/types";
import { DicePassthru } from "@language-v2/types/dice-passthru";
import { Value } from "@language-v2/types/value";
import _ from "lodash";
import { dieFormatter } from "./roll-simple";

export function unaryMinus($$container: Delayed<Dice>): Delayed<DicePassthru>
export function unaryMinus($$container: Delayed<Value>): Delayed<Value>
export function unaryMinus($$container: Delayed<Values>): Delayed<Values>
export function unaryMinus($$container: Delayed<Dice | Values | Value>): Delayed<DicePassthru | Values | Value> {
  return (ctx) => {
    const $container = $$container(ctx);
    ctx.trace("unary-minus: " + $container.pretties);

    const rightSidePretties = `-(${$container.pretties})`;

    if ($container instanceof Value) {
      const newValue = -$container.value;
      return new Value({
        value: newValue,
        pretties: `${newValue} ⟵ ${rightSidePretties}`,
        parentValues: [$container],
      });
    }

    if ($container instanceof Dice) {
      const newValues = $container.values.map(v => -v);
      const newValue = -$container.value;
      return new DicePassthru({
        $dieSize: $container.$dieSize,
        $howMany: $container.$howMany,
        pretties: `[${newValues.map(v => dieFormatter(v, $container.$dieSize.value, true)).join(", ")}] ⟵ ${rightSidePretties}`,
        value: newValue,
        values: newValues,
        parentValues: [$container],
      });
    }

    if ($container instanceof Values) {
      const newValues = $container.values.map(v => -v);
      const newValue = -$container.value;
      return new Values({
        pretties: `[${newValues.join(", ")}] ⟵ ${rightSidePretties}`,
        value: newValue,
        values: newValues,
        parentValues: [$container],
      });
    }

    throw "Unary Minus passed unexpected type";
  };
}