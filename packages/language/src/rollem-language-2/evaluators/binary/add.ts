import { Delayed, Dice, Integer, Value } from "../..";

export function add($$left: Delayed<Value>, $$right: Delayed<Value>): Delayed<Value> {
  return (ctx) => {
    debugger;
    const $left = $$left(ctx);
    const $right = $$right(ctx);
    const total = $left.value + $right.value;
    ctx.trace(`add: ${$left}`);
    ctx.trace(`add: ${$right}`);
    return new Value({
      parentValues: [$left, $right],
      value: total,
      pretties: `${total} ⟵ ${$left.pretties} + ${$right.pretties}`
    });
  };
}