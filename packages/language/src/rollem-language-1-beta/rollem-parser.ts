import Peg from "pegjs";
import fs from 'fs';
import path from 'path';
import { ContainerV1Beta } from "./container";

const parser = require('./rollem.pegjs');
export class RollemParserV1Beta {
  // returns false if parsing failed due to grammar match failure
  tryParse(input: string): ContainerV1Beta | false
  {
    try {
      return parser.parse(input)
    } catch (ex){
      // console.warn(input + " -> " + ex);
      if (ex.location === "CUSTOM") {
        return {
          depth: 0,
          dice: 0,
          pretties: ex.message as string,
          value: 0,
          values: [0],
          error: ex.message as string,
          label: "error"
        }
      }

      return false;
    }
  }

  // returns errors relating to grammar match failure
  parse(input: string): ContainerV1Beta
  {
    try {
      return parser.parse(input)
    } catch (ex){
      // console.warn(input + " -> " + ex);
        return {
          depth: 0,
          dice: 0,
          pretties: ex.message as string,
          value: 0,
          values: [0],
          error: ex.message as string,
          label: "error"
        }
    }
  }

}