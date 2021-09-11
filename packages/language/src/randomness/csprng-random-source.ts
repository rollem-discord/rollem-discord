import { randomInt } from "crypto";

/** A source of randomness that Rollem can use. */
export class CsprngRandomSource {
	/** Produces an integer in the range of min and max. Includes min and max. */
	public nextInteger(options: { min: number, max: number }): number {
		return randomInt(options.min, options.max + 1);
	}
}