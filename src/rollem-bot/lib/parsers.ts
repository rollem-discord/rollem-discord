import { RollemParserV1 } from "@language-v1/rollem-parser";
import { RollemParserV2 } from "@language-v2/rollem-parser";

export class Parsers {
  constructor(
    public readonly v1: RollemParserV1,
    public readonly v2: RollemParserV2,
  ) { }
}