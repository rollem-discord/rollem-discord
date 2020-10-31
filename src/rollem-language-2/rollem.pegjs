{
  // see ./rollem-header.ts and gulpfile.js for how imports are handled
}

start
  = result: Expression label:Label? {
    result.label = label;
    result.values = [result.value];
    return result;
  }

Label
 = _____ label:(Garbage)? {
   return label;
 }

Expression
  = UnaryMinus
    /
    RollSimple
    /
    Integer

UnaryMinus
  = "-" e:Expression {
    return unaryMinus(e);
  }

RollSimple
  = left:PositiveInteger? [dD] right:Integer {
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
