/** A source of randomness that Rollem can use. */
export interface RollemRandomSource {
	/** Produces an integer in the range of min and max. Includes min and max. */
	nextInteger(options: { min: number, max: number }): number;
}