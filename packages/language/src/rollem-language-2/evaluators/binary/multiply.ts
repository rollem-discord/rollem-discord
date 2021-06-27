import { Delayed, Dice, Integer, Value } from "../..";

export function multiply($$left: Delayed<Value>, $$right: Delayed<Value>): Delayed<Value> {
  return (ctx) => {
    debugger;
    const $left = $$left(ctx);
    const $right = $$right(ctx);
    const total = $left.value * $right.value;
    ctx.trace(`multiply: ${$left}`);
    ctx.trace(`multiply: ${$right}`);
    return new Value({
      parentValues: [$left, $right],
      value: total,
      pretties: `${total} ⟵ ${$left.pretties} * ${$right.pretties}`
    });
  };
}