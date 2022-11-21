import { Grammar, Parser } from "nearley";
import grammar from "./rollem";
import { expect } from "chai";
import "mocha";

describe.only("Rollem Nearley", () => {
  it.only("nearley", () => {
    const parser = new Parser(Grammar.fromCompiled(grammar));
    parser.feed("1+1");

    console.log(JSON.stringify(parser.results));
    console.log(JSON.stringify(parser.results[0]));
    expect("what").to.equal("what");
  });
});
