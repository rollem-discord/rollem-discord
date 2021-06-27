import { Delayed, Dice, Integer } from "../..";

function minFormatter(formatted) {
  return "**" + formatted + "**";
}

function maxFormatter(formatted) {
  return "**" + formatted + "**";
}

function dropFormatter(formatted) {
  return "~~" + formatted + "~~";
}

// This is used to configure stylization of the individual die results.
export function dieFormatter(value, size, isKept = true) {
  let formatted = value
  if (value >= size)
    formatted = maxFormatter(formatted);
  else if (value === 1)
    formatted = minFormatter(formatted);

  if (!isKept)
    formatted = dropFormatter(formatted);

  return formatted;
}

export function rollSimple($$howMany: Delayed<Integer> | null | undefined, $$dieSize: Delayed<Integer>): Delayed<Dice | Integer> {
  return (ctx) => {
    const allRolls: number[] = [];
    const $howMany = $$howMany ? $$howMany(ctx) : Integer.fromNumber(1);
    const howMany = $howMany.value;
    const $dieSize = $$dieSize(ctx);
    ctx.trace(`roll-simple: die-size: ${$dieSize}`);
    ctx.trace(`roll-simple: how-many: ${howMany}`);

    for (let i = 0; i < howMany; i++) {
      allRolls.push(ctx.chance.integer({min: 1, max: $dieSize.value}));
    }

    allRolls.sort();
    const sum = allRolls.reduce((accum, cur) => accum + cur, 0);

    // TODO: this formatter should probably preserve the contents of the right hand side if the type is complex
    const pretties = `[${allRolls.map(v => dieFormatter(v, $dieSize.value, true)).join(", ")}] ⟵ ${howMany}d${$dieSize.value}`
    return new Dice({
      $howMany: $howMany,
      $dieSize: $dieSize,
      value: sum,
      values: allRolls,
      pretties: pretties,
      parentValues: [$howMany, $dieSize],
    });
  };
}