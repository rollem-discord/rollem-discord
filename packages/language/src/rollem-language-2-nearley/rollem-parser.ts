// import { SyntaxError, parse } from "./rollem";
// import { OldContainer } from "./types";
// import { Delayed } from "./types/delayed";
import { Grammar, Parser } from "nearley";
import grammar from "./rollem";

const parser = new Parser(Grammar.fromCompiled(grammar))
parser.feed("foo\n");

console.log(JSON.stringify(parser.results));

export class RollemParserV2Nearley {
  // tryParse(input: string): Delayed<OldContainer> | false
  // {
  //   try {
  //     return parse(input)
  //   } catch (ex) {
  //     // TODO: Custom error handling
  //     return false;
  //   }
  // }

  // parse(input: string): Delayed<OldContainer>
  // {
  //   try {
  //     return parse(input)
  //   } catch (ex) {
  //     if (ex instanceof SyntaxError) {
  //       throw ex;
  //     }

  //     throw ex;
  //   }
  // }
}
