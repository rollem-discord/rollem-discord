import { Integer } from "@language-v2/types/integer";
import { OldContainer } from "@language-v2/types";
import { Delayed } from "@language-v2/types/delayed";
import { Dice } from "@language-v2/types/dice";

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
function dieFormatter(value, size, isKept = true) {
  let formatted = value
  if (value >= size)
    formatted = maxFormatter(formatted);
  else if (value === 1)
    formatted = minFormatter(formatted);

  if (!isKept)
    formatted = dropFormatter(formatted);

  return formatted;
}

export function rollSimple($$howMany: Delayed<Integer> | null | undefined, $$dieSize: Delayed<Integer>): Delayed<OldContainer> {
  return (ctx) => {
    const allRolls: number[] = [];
    const $howMany = $$howMany ? $$howMany(ctx) : null;
    const howMany = $howMany?.value ?? 1;
    const $dieSize = $$dieSize(ctx);

    for (let i = 0; i < howMany; i++) {
      allRolls.push(ctx.chance.integer({min: 1, max: $dieSize.value}));
    }

    allRolls.sort();
    const sum = allRolls.reduce((accum, cur) => accum + cur, 0);
    const pretties = `[${allRolls.map(v => dieFormatter(v, $dieSize.value, true)).join(", ")}] ⟵ ${howMany}d${$dieSize.value}`
    return new Dice({
      value: sum,
      values: allRolls,
      pretties: pretties,
      depth: 1,
      dice: howMany
    });
  };
}