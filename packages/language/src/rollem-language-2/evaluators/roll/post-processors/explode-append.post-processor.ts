import { sum } from "lodash";
import { Context, Delayed, Dice, Integer } from "../../..";
import { dieFormatter } from "../helpers";

export function explodeAppendPostProcessor($$dice: Delayed<Dice>): Delayed<Dice> {
	return (ctx: Context) => {
		const $dice = $$dice(ctx);
		const allRolls: number[] = [];
		const newDice: number[] = [];
		ctx.trace(`explode on max`);
		for (let i = 0; i < $dice.values.length; i++) {
			let lastValue = $dice.values[i];
			allRolls.push(lastValue);
			while (lastValue === $dice.$dieSize.value) {
				lastValue = ctx.randomSource.nextInteger({min: 1, max: $dice.$dieSize.value});
				allRolls.push(lastValue);
				newDice.push(lastValue);
			}
		}

    allRolls.sort();
    const total = sum(allRolls);
    const pretties = `[${allRolls.map(v => dieFormatter(v, $dice.$dieSize.value, true)).join(", ")}] ⟵ exploded ${$dice.$howMany.value}d${$dice.$dieSize.value}`

		return new Dice({
			$dieSize: $dice.$dieSize,
			$howMany: Integer.fromNumber(newDice.length),
			parentValues: [$dice],
			pretties: pretties,
			value: total,
			values: allRolls,
		})
	}
}