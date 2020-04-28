export interface OldContainerInput {
  value: number;
  values: number[];
  pretties: string;
  depth: number;
  dice: number;
}

export class OldContainer {
  public readonly value: number;
  public readonly values: number[];
  public readonly pretties: string;
  public readonly depth: number;
  public readonly dice: number;

  constructor(input: OldContainerInput) {
    this.value = input.value;
    this.values = input.values;
    this.pretties = input.pretties;
    this.depth = input.depth;
    this.dice = input.dice;
  }
}