import { SyntaxError, parse } from "./rollem";
import { OldContainer } from "./evaluators/old-container";
import { Delayed } from "./evaluators/types";

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
