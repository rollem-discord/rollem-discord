{
  // see ./rollem-header.ts and gulpfile.js for how imports are handled
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
  = RollSimple
    /
    Integer

RollSimple
  = left:Integer? [dD] right:Integer {
    return rollSimple(left, right);
  }

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
