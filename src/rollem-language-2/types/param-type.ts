// TODO: Seems typescript can't quite handle "The same object but with all the functions optional" yet.

/** For generating parameter types for containers. */
export type ParamType<T> = Omit<T, "depth" | "dice">;
