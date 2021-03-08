import { SyntaxError, parse } from "./rollem";
import { OldContainer } from "./types";
import { Delayed } from "./types/delayed";

export class RollemParserV2 {
  tryParse(input: string): Delayed<OldContainer> | false
  {
    try {
      return parse(input)
    } catch (ex) {
      // TODO: Custom error handling
      return false;
    }
  }

  parse(input: string): Delayed<OldContainer>
  {
    try {
      return parse(input)
    } catch (ex) {
      if (ex instanceof SyntaxError) {
        throw ex;
      }

      throw ex;
    }
  }
}
