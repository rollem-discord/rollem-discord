{
	let assert = (predicate, raiseText) => { if(!predicate) { throw raiseText; } };
	let assertType = (value, name, type) => assert(typeof value === type, 'RollemHooks.' + name + ' ' + type + ' must be provided.');
	let assertFunction = (value, name) => assertType(value, name, 'function');

	assert(typeof RollemHooks === 'object', 'RollemHooks object must be provided.');

	assertFunction(RollemHooks.rollEvaluator, 'rollEvaluator');


  function makeCounter(left, expr, right) {
    var evaluator = null;
    switch(expr) {
      case "<<":
        evaluator = function(v) { return v <= right.value; }
        break;
      case ">>":
        evaluator = function(v) { return v >= right.value; }
        break;
    }

    var count = 0;
    left.values.forEach(function(v,i,arr) { if (evaluator(v)) { count++; } });

    return {
      "value": count,
      "values": [ count ],
      "pretties": left.pretties + " " + expr + " " + right.pretties,
      "depth": Math.max(left.depth, right.depth) + 1,
      "dice": left.dice + right.dice
    };
  }

  function makeInteger(text) {
    var value = parseInt(text, 10);
    return {
        "value": value,
          "values": [ value ],
          "pretties": text,
          "depth": 1,
          "dice": 0
      };
  }

  // TODO: generalize roll structure
  function makeFateRoll(left) {
    var size = 3;
    var count = left ? left.value : 1;
    if (count > 100) { UserError("Maximum die count is 100.", "CUSTOM"); }
    var values_arr = [];

    // roll
    for (var i=0; i < count; i++)
    {
      var newVals = RollemHooks.rollEvaluator(size);
      Array.prototype.push.apply(values_arr, newVals);
    }

    // map d3 to -1 0 1
    values_arr = values_arr.map(v => v - 2);

    // total
    var accumulator = 0;
    values_arr.forEach(function(v,i,arr) { accumulator += v; });

    // make pretties int - 0 +
    var pretties_arr = values_arr.sort((a,b) => a - b).reverse().map(function(v,i,arr) {
      switch(v) {
        case 0: return "0";
        case 1: return "+";
        case -1: return "-";
        default: return "broken";
      }
    });

    var pretties = "[" + pretties_arr.join(", ") + "]" + count + "dF";

    values_arr = values_arr.sort((a,b) => a - b);
    var depth = left ? left.depth+1 : 2;
    var dice = left ? left.value : 1;
    return {
        "value": accumulator,
        "values": values_arr,
        "pretties": pretties,
        "depth": depth,
        "dice": dice
    };
  }

  function makeBasicRoll(left, right, explode) {
    var size = right.value;
    var count = left ? left.value : 1;

    if (size <= 1) { UserError("Minimum die size is 2.", "CUSTOM"); }
    if (count > 100) { UserError("Maximum die count is 100.", "CUSTOM"); }
    var values_arr = [];

    // roll
    for (var i=0; i < count; i++)
    {
      var newVals = RollemHooks.rollEvaluator(size, explode);
      Array.prototype.push.apply(values_arr, newVals);
    }

    // total
    var accumulator = 0;
    values_arr.forEach(function(v,i,arr) { accumulator += v; });

    // format
    var pretties_arr = values_arr.sort((a,b) => a - b).reverse().map(function(v,i,arr) {
      return dieFormatter(v, size);
    });

    var pretties = "[" + pretties_arr.join(", ") + "]" + count + "d" + right.pretties;
    if (explode) { pretties = pretties + "!"; }

    values_arr = values_arr.sort((a,b) => a - b);
    var depth = left ? Math.max(left.depth, right.depth)+1 : right.depth+1;
    var dice = left ? left.value : 1;
    return {
        "value": accumulator,
        "values": values_arr,
        "pretties": pretties,
        "depth": depth,
        "dice": dice
    };
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
