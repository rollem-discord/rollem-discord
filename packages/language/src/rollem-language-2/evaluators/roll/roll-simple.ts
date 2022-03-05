import { sum } from "lodash";
import { Delayed, Dice, Integer } from "../..";
import { dieFormatter } from "./helpers";

export function rollSimple($$howMany: Delayed<Integer> | null | undefined, $$dieSize: Delayed<Integer>): Delayed<Dice | Integer> {
  return (ctx) => {
    const allRolls: number[] = [];
    const $howMany = $$howMany ? $$howMany(ctx) : Integer.fromNumber(1);
    const howMany = $howMany.value;
    const $dieSize = $$dieSize(ctx);
    ctx.trace(`roll-simple: die-size: ${$dieSize}`);
    ctx.trace(`roll-simple: how-many: ${howMany}`);

    for (let i = 0; i < howMany; i++) {
      allRolls.push(ctx.randomSource.nextInteger({min: 1, max: $dieSize.value}));
    }

    allRolls.sort();
    const total = sum(allRolls);

    // TODO: this formatter should probably preserve the contents of the right hand side if the type is complex
    const pretties = `[${allRolls.map(v => dieFormatter(v, $dieSize.value, true)).join(", ")}] ⟵ ${howMany}d${$dieSize.value}`
    return new Dice({
      $howMany: $howMany,
      $dieSize: $dieSize,
      value: total,
      values: allRolls,
      pretties: pretties,
      parentValues: [$howMany, $dieSize],
    });
  };
}