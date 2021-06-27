{
  // see ./rollem-header.ts and gulpfile.js for how imports are handled
}

start
  = result: Expression5 label:Label? {
    result.label = label;
    result.values = [result.value];
    return result;
  }

Label "label"
 = _____ label:(Garbage)? {
   return label;
 }

Expression5 "expression 0"
  = AdditionSubtraction
  / Expression1

AdditionSubtraction "additionsubtraction"
  = l:Expression1 r_list:(_ ("+" / "-") _ Expression1)* {
    // TODO: Move this out of the syntax.
    let result = l;
    for (let i = 0; i < r_list.length; i++) {
      const op = r_list[i][1];
      const r = r_list[i][3];
      switch (op) {
        case '+':
          result = add(result, r);
          break;
        case '-':
          result = subtract(result, r);
          break;
        default:
          throw new Error('Addition-Subtraction switch case should never be hit');
      }
    }
    
    return result;
  }

Expression1 "expression 1"
  = RollSimple
    /
    Expression0
    /
    UnaryMinus

Expression0 "expression 0"
  = Integer
  / PositiveInteger

UnaryMinus "unary minus"
  = "-" e:Expression5 {
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
