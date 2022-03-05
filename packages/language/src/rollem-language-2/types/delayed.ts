import { Context } from "./context";

export type Delayed<T> = (ctx: Context) => T;
export type DelayedMap<TIn, TOut> = ($in: Delayed<TIn>) => Delayed<TOut>;

/** Combines two delayed maps into a single delayed map. */
export function composeDelayed<T1,T2,T3>(map1: DelayedMap<T1,T2>, map2: DelayedMap<T2, T3>): DelayedMap<T1,T3> {
	return ($in: Delayed<T1>) => {
		return map2(map1($in));
	}
}

export function pipeDelayed<T2,T3>(generator: Delayed<T2>, map: DelayedMap<T2, T3>): Delayed<T3> {
	return map(generator);
}

// sample of use
// const generator = (i: Delayed<number>, j: Delayed<number>) => (ctx: Context) => (i(ctx) + j(ctx)) > 2;
// const complex: Delayed<boolean> = generator((ctx) => 1, (ctx) => 2);
// const a: DelayedMap<number, boolean> = (i) => (ctx: Context) => false;
// const b: DelayedMap<boolean, string> = (i) => (ctx: Context) => "5";
// const x: DelayedMap<number, string> = composeDelayed(a, b);
// const y: DelayedMap<number, string> = pipeDelayed(complex, b);