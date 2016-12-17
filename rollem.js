const Peg = require("pegjs");
const fs = require('fs');
const path = require('path');

var grammarLocation = path.join(__dirname, '/grammar/rollem.pegjs');
var grammar = fs.readFileSync(grammarLocation, 'utf8');
var parser = Peg.generate(grammar)

// returns false if parsing failed due to grammar match failure
exports.tryParse = function(input)
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
exports.parse = function(input)
{
  try {
    return parser.parse(input)
  } catch (ex){
//     console.warn(input + " -> " + ex);
    return ex.message;
  }
}
