import Peg from "pegjs";
import fs from 'fs';
import path from 'path';
import { ContainerV1 } from "./container";
import { parse } from './rollem';

export class RollemParserV1 {
  // returns false if parsing failed due to grammar match failure
  tryParse(input: string): ContainerV1 | false
  {
    try {
      return parse(input) as (ContainerV1 | false)
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
  parse(input: string): ContainerV1
  {
    try {
      return parse(input) as ContainerV1
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