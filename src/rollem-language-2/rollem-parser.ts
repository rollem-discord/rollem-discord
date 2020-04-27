import Peg from "pegjs";
import TSPeg from "ts-pegjs";
import fs from 'fs';
import path from 'path';

const grammarLocation = path.join(__dirname, 'rollem.pegjs');
const grammar = fs.readFileSync(grammarLocation, 'utf8');

const parser = Peg.generate(grammar, {
  plugins: [TSPeg]
});


export class RollemParserV2 {
  // returns false if parsing failed due to grammar match failure
  tryParse(input: string): any
  {
    try {
      return parser.parse(input)
    } catch (ex){
  //     console.warn(input + " -> " + ex);
      if (ex.location === "CUSTOM") {
        return ex.message;
      }

      return false;
    }
  }

  // returns errors relating to grammar match failure
  parse(input: string): any
  {
    try {
      return parser.parse(input)
    } catch (ex){
  //     console.warn(input + " -> " + ex);
      return ex.message;
    }
  }

}