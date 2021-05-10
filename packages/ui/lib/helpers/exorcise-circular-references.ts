/** Returns a clone of the target with all circular references replaced by CIRCULAR. */
export function exorciseCircularReferences<T>(input: T): T {
  const seen = [];
  const stringified = JSON.stringify(input, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.includes(value)) {
        return "CIRCULAR";
      }
      seen.push(value);
    }

    return value;
  });

  return JSON.parse(stringified);
}
