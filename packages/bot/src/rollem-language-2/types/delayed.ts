import { Context } from "./context";

export type Delayed<T> = (ctx: Context) => T;