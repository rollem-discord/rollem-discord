{
	let assert = (predicate, raiseText) => { if(!predicate) { throw raiseText; } };
	let assertType = (value, name, type) => assert(typeof value === type, 'RollemHooks.' + name + ' ' + type + ' must be provided.');
	let assertFunction = (value, name) => assertType(value, name, 'function');

	assert(typeof RollemHooks === 'object', 'RollemHooks object must be provided.');

	assertFunction(RollemHooks.rollEvaluator, 'rollEvaluator');
  }

  // This is used to configure stylization of the individual die results.
  function dieFormatter(value, size) {
    if (value == size)
      return maxFormatter(value);
    else if (value == 1)
      return minFormatter(value);
    else
      return value;
  }

  function minFormatter(value) {
    return "**" + value + "**";
  }

  function maxFormatter(value) {
    return "**" + value + "**";
  }
}

start
  = result: Comparator label:Label?{
    result.label = label;
    result.values = [result.value];
    return result;
  }

Label
 = _____ label:(Garbage)? {
   return label;
 }

Comparator
  = left:Counter _ expr:("<=" / ">=" / "==" / "=" / "<" / ">"  ) _ right:Counter {
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
      console.log(left.dice, right.dice);
      return {
          "value": value,
          "values": values,
          "pretties": withValue,
          "depth": Math.max(left.depth, right.depth) + 1,
          "dice": left.dice + right.dice
      };
    }
    / Counter
    / Expression

Counter
  = left:Expression _ expr:( "<<" / ">>" ) _ right:Expression {
      return makeCounter(left, expr, right);
    }
    / Expression

Expression
  = left:Term right:(_ ("+" / "-") _ Term)* {
      var result = left, i;

      for (i = 0; i < right.length; i++) {
        var current = right[i][3];
        result.depth = Math.max(result.depth, current.depth + 1);
        result.dice = result.dice + current.dice;
        if (right[i][1] === "+") {
          result.value += current.value;
          result.values = result.values.map(function(val) {
            return val + current.value;})
          result.pretties = result.pretties + " + " + current.pretties;
        }
        if (right[i][1] === "-") {
          result.value -= current.value
          result.values = result.values.map(function(val) {
            return val - current.value; })
          result.pretties = result.pretties + " - " + current.pretties;
        }
      }

      return result;
    }

Term
  = left:Factor right:(_ ("*" / "/") _ Factor)* {
      var result = left, i;

      for (i = 0; i < right.length; i++) {
        var current = right[i][3];
        result.depth = Math.max(result.depth, current.depth + 1);
        result.dice = result.dice + current.dice;
        if (right[i][1] === "*") {
          result.value *= current.value;
          result.values = result.values.map(function(val) {
            return val * current.value; })
          result.pretties = result.pretties + " \\* " + current.pretties;
        }
        if (right[i][1] === "/") {
          result.value /= current.value
          result.values = result.values.map(function(val) {
            return val / current.value; })
          result.pretties = result.pretties + " / " + current.pretties;
        }
      }

      return result;
    }

Factor
  = "(" _ expr:Expression _ ")"
  {
    expr.depth += 1;
    return expr;
  }
  / BasicRoll
  / BurningWheelRoll
  / FateRoll
  / Integer

FateRoll
  = left:Integer? [dD] "F" {
    return makeFateRoll(left);
  }

BurningWheelRoll
  = left:[BGW] right:Integer explode:"!"? {
      let rollLeft = right;
      let rollRight = makeInteger("6");
      let rollResult = makeBasicRoll(rollLeft, rollRight, explode);
      debugger;
      let counterRight = null;

      switch (left) {
        case "B":
          counterRight = makeInteger("4");
          break;
        case "G":
          counterRight = makeInteger("3");
          break;
        case "W":
          counterRight = makeInteger("2");
          break;
      }

      debugger;
      let counterResult = makeCounter(rollResult, ">>", counterRight);
      counterResult.pretties = `${left}${right.pretties} (${counterResult.pretties})`

      return counterResult;
    }

BasicRoll
  = left:Integer? [dD] right:Integer explode:"!"? {
      return makeBasicRoll(left, right, explode);
    }

Integer "integer"
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
