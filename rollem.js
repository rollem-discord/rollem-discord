const Peg = require("pegjs");
const fs = require('fs');
const path = require('path');

var grammarLocation = path.join(__dirname, '/grammar/rollem.pegjs');
console.log(grammarLocation);
var grammar = fs.readFileSync(grammarLocation, 'utf8');
console.log(grammar);
var parser = Peg.generate(grammar)

exports.parse = function(input)
{
  try {
    return parser.parse(input)
  } catch (ex){
    console.warn(input + " -> " + ex);
    if (ex.location === "CUSTOM") {
      return ex.message;
    }

    return false;
  }
}
