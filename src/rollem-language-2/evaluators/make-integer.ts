import { OldContainer } from "./old-container";
import { Delayed } from "./types";

export default function makeInteger(text: string): Delayed<OldContainer> {
  const value = parseInt(text, 10);
  return () => new OldContainer({
    value: value,
    values: [ value ],
    pretties: text,
    depth: 1,
    dice: 0
  });
}