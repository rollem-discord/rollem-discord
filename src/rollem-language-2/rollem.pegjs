{
  // see ./rollem-header.ts and gulpfile.js for how imports are handled
  debugger;
}

start
  = result: Comparator label:Label? {
    result.label = label;
    result.values = [result.value];
    return result;
  }

Label
 = _____ label:(Garbage)? {
   return label;
 }

Comparator
  = left:Integer _ expr:("<=" / ">=" / "==" / "=" / "<" / ">"  ) _ right:Integer {
      var wasSuccess = false;
      switch(expr) {
        case "<":
          wasSuccess = left.value < right.value;
          break;
        case "<=":
          wasSuccess = left.value <= right.value;
          break;
        case ">":
          wasSuccess = left.value > right.value;
          break;
        case ">=":
          wasSuccess = left.value >= right.value;
          break;
        case "=":
        case "==":
          wasSuccess = left.value == right.value;
          break;
      }
      var withValue =
        left.value + " " + expr + " " + right.value +
        " ⟵ " + left.pretties + " " + expr + " " + right.pretties;

      var value = wasSuccess;
      var values = wasSuccess ? [1] : [0];

      return {
          "value": value,
          "values": values,
          "pretties": withValue,
          "depth": Math.max(left.depth, right.depth) + 1,
          "dice": left.dice + right.dice
      };
    }
    /
    Integer

Integer "integer"
  = "-"?[0-9]+ {
      return makeInteger(text());
    }

_ "whitespace"
  = [   \n\r]*

_____ "forced whitespace"
= [   \n\r]+

Garbage "any characters"
 = [^]* {
   return text();
 }
