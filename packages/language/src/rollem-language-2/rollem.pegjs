{
  // see ./rollem-header.ts and gulpfile.js for how imports are handled
  // asdfadsfalksdfjalsdfjkl
}

start
  = result: Expression0 label:Label? {
    result.label = label;
    result.values = [result.value];
    return result;
  }

Label "label"
 = _____ label:(Garbage)? {
   return label;
 }

Expression0 "expression 0"
  = UnaryMinus
  / Expression1

Expression1 "expression 1"
  = RollSimple
    /
    PositiveInteger
    /
    Integer

UnaryMinus "unary minus"
  = "-" e:Expression0 {
    return unaryMinus(e);
  }

RollSimple "roll(simple)"
  = left:PositiveInteger? [dD] right:PositiveInteger {
    return rollSimple(left, right);
  }

Integer "integer"
  = "-"?[0-9]+ {
      return makeInteger(text());
    }

PositiveInteger "positive integer"
  = [0-9]+ {
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
