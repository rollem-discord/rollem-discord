import { SyntaxError, parse } from "./rollem";

export class RollemParserV2 {
  tryParse(input: string): any
  {
    try {
      return parse(input)
    } catch (ex) {
      // TODO: Custom error handling

      return false;
    }
  }

  parse(input: string): any
  {
    try {
      return parse(input)
    } catch (ex) {
      if (ex instanceof SyntaxError) {
        return ex.message;
      }

      return ex.message;
    }
  }
}
