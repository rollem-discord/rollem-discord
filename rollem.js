const Peg = require("pegjs");
const fs = require('fs');
const path = require('path');

// var grammarLocation = path.join(__dirname, '/grammar/rollem.pegjs');
// var grammar = fs.readFileSync(grammarLocation, 'utf8');

RollemHooks = require('./grammar/RollemHooks.js').configurations.default;

// var parser = Peg.generate(grammar);

let parser = require('./dist/rollem.js');

// returns false if parsing failed due to grammar match failure
exports.tryParse = function(input)
{
  try {
    let result = parser.parse(input);
    return result;
  } catch (ex){
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
    return ex.message;
  }
}
