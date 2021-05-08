import { RollemParserV1 } from "@language-v1/rollem-parser";
import { RollemParserV2 } from "@language-v2/rollem-parser";
import { RollemParserV1Beta } from "@language-v1-beta/rollem-parser";
import { Injectable } from "injection-js";

@Injectable()
export class Parsers {
  constructor(
    public readonly v1: RollemParserV1,
    public readonly v1beta: RollemParserV1Beta,
    public readonly v2: RollemParserV2,
  ) { }
}