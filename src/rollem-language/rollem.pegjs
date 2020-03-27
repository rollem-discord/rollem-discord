{
  function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }
   // Object Format:
    // {
    //   value = 27,
    //   values = [ value1, value2, value3 ],
    //   pretties = "[value1, value2, **value3**]",
    //   label = "Anything you want",
    //   dice = 0
    // }
   function maxEvaluator(size) { return size; }
   function minEvaluator(size) { return 1; }
   function rollEvaluator(size, explodeConfiguration) {
    var all_rolls = [];
    var minimumExplodeSize =
      (explodeConfiguration && explodeConfiguration.value)
      ? explodeConfiguration.value
      : size;
    do {
      var last_roll = Math.floor(Math.random() * size) + 1;
      all_rolls.push(last_roll);
    } while (last_roll >= minimumExplodeSize && explodeConfiguration)
    return all_rolls;
  }

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
    if (count > 100) { error("Maximum die count is 100.", "CUSTOM"); }
    var valuesArr = [];

    // roll
    for (var i=0; i < count; i++)
    {
      var newVals = singleDieEvaluator(size);
      Array.prototype.push.apply(valuesArr, newVals);
    }

    // map d3 to -1 0 1
    valuesArr = valuesArr.map(v => v - 2);

    // total
    var accumulator = 0;
    valuesArr.forEach(function(v,i,arr) { accumulator += v; });

    // make pretties int - 0 +
    var prettiesArr = valuesArr.sort((a,b) => a - b).reverse().map(function(v,i,arr) {
      switch(v) {
        case 0: return "0";
        case 1: return "+";
        case -1: return "-";
        default: return "broken";
      }
    });

    var pretties = "[" + prettiesArr.join(", ") + "]" + count + "dF";

    valuesArr = valuesArr.sort((a,b) => a - b);
    var depth = left ? left.depth+1 : 2;
    var dice = left ? left.value : 1;
    return {
        "value": accumulator,
        "values": valuesArr,
        "pretties": pretties,
        "depth": depth,
        "dice": dice
    };
  }

  function makeBasicRoll(left, right, explodeConfiguration, configuration) {
    var size = right.value;
    var count = left ? left.value : 1;
    var allSameAndExplode = configuration.allSameAndExplode;
    var noSort = configuration.noSort || allSameAndExplode;
    var keepDropOperator = configuration.operator;
    var keepDropValue = clamp(configuration.value || 0, 0, count);

    if (size <= 1) { error("Minimum die size is 2.", "CUSTOM"); }
    if (count > 100) { error("Maximum die count is 100.", "CUSTOM"); }

    var valuesArr = [];

    // roll
    for (var i=0; i < count; i++)
    {
      var newVals = singleDieEvaluator(size, explodeConfiguration);
      Array.prototype.push.apply(valuesArr, newVals);
    }

    // allSameAndExplode
    if (allSameAndExplode && valuesArr.length >= 2) {
      var allSame = valuesArr.every(v => v == valuesArr[0]);
      while (allSame) {
        var newVals = singleDieEvaluator(size, explodeConfiguration);
        allSame = newVals.every(v => v == valuesArr[0]);
        Array.prototype.push.apply(valuesArr, newVals);
      }
    }

    // handle keep-drop
    var augmentedValuesArr = valuesArr.map(v => { return {value: v, isKept: false}; });
    var sortedAugmentedValuesArr = Array.from(augmentedValuesArr).sort((a,b) => a.value - b.value).reverse();
    var keepRangeStart = 0;
    var keepRangeEndExclusive = sortedAugmentedValuesArr.length;
    var critrange = size;
    switch (keepDropOperator) {
      case "kh":
        keepRangeEndExclusive = keepDropValue;
        break;
      case "kl":
        keepRangeStart = sortedAugmentedValuesArr.length - keepDropValue;
        break;
      case "dh":
        keepRangeStart = keepDropValue;
        break;
      case "dl":
        keepRangeEndExclusive = sortedAugmentedValuesArr.length - keepDropValue
        break;
      case "c":
        critrange = configuration.value;
        break;
      default:
        // leave it at the default (keep everything)
        break;
    }

    sortedAugmentedValuesArr.slice(keepRangeStart, keepRangeEndExclusive).forEach(v => v.isKept = true);

    // total
    var accumulator = 0;
    augmentedValuesArr.filter(v => v.isKept).forEach((v,i,arr) => accumulator += v.value);

    // format
    var formatOrder = noSort ? augmentedValuesArr : sortedAugmentedValuesArr;
    var prettiesArr = formatOrder.map((v,i,arr) => {
      //critrange is by default = to size 
      return dieFormatter(v.value, critrange, v.isKept);
    });

    var pretties = "[" + prettiesArr.join(", ") + "]" + count + "d" + right.pretties;
    if (explodeConfiguration) {
      pretties = pretties + "!";
      if (explodeConfiguration.value) {
        pretties = pretties + explodeConfiguration.value;
      }
    }
    if (keepDropOperator) { pretties = pretties + keepDropOperator + keepDropValue; }

    valuesArr = sortedAugmentedValuesArr.filter(v => v.isKept).map(v => v.value);
    var depth = left ? Math.max(left.depth, right.depth)+1 : right.depth+1;
    var dice = left ? left.value : 1;
    return {
        "value": accumulator,
        "values": valuesArr,
        "pretties": pretties,
        "depth": depth,
        "dice": dice
    };
  }

  // This is used to configure how the dice calculations are performed.
  var singleDieEvaluator = rollEvaluator;

  // This is used to configure stylization of the individual die results.
  function dieFormatter(value, size, isKept = true) {
    var formatted = value
    if (value >= size)
      formatted = maxFormatter(formatted);
    else if (value == 1)
      formatted = minFormatter(formatted);

    if (!isKept)
      formatted = dropFormatter(formatted);
    
    return formatted;
  }

  function minFormatter(formatted) {
    return "**" + formatted + "**";
  }

  function maxFormatter(formatted) {
    return "**" + formatted + "**";
  }

  function dropFormatter(formatted) {
    return "~~" + formatted + "~~";
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
  = left:Term right:(_ ("++" / "--" / "+" / "-") _ Term)* {
      var result = left, i;

      for (i = 0; i < right.length; i++) {
        var current = right[i][3];
        result.depth = Math.max(result.depth, current.depth + 1);
        result.dice = result.dice + current.dice;
        var symbol = right[i][1];
        switch (symbol) {
          case "+":
            result.value += current.value;
            result.values = [result.value];
            result.pretties = result.pretties + " + " + current.pretties;
            break;
          case "-":
            result.value -= current.value
            result.values = [result.value];
            result.pretties = result.pretties + " - " + current.pretties;
            break;
          case "++":
            result.value += current.value * result.values.length;
            result.values = result.values.map(function(val) {
              return val + current.value;})
            var prettiesArr = result.values.sort((a,b) => a - b).reverse()
            var joined = "[" + prettiesArr.join(", ") + "]";
            result.pretties = joined + " ⟵ " + result.pretties + " ++ " + current.pretties;
            break;
          case "--":
            result.value -= current.value * result.values.length;
            result.values = result.values.map(function(val) {
              return val - current.value; })
            var prettiesArr = result.values.sort((a,b) => a - b).reverse()
            var joined = "[" + prettiesArr.join(", ") + "]";
            result.pretties = joined + " ⟵ " + result.pretties + " -- " + current.pretties;
            break;
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
  = left:Integer? [dD] [Ff] {
    return makeFateRoll(left);
  }

BurningWheelRoll
  = left:[BGW] right:Integer explode:"!"? {
      let rollLeft = right;
      let rollRight = makeInteger("6");
      let rollResult = makeBasicRoll(rollLeft, rollRight, explode, {});

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

      let counterResult = makeCounter(rollResult, ">>", counterRight);
      counterResult.pretties = `${left}${right.pretties} (${counterResult.pretties})`

      return counterResult;
    }

BasicRoll
  = left:Integer? [dD] right:Integer explodeConfiguration:ExplodeConfiguration? configuration:BasicRollConfiguration {
      return makeBasicRoll(left, right, explodeConfiguration, configuration);
    }

ExplodeConfiguration
  = "!" value:Integer? {
    return {
      operator: "!",
      value: value && value.value || null
    }
  }

BasicRollConfiguration
  = keepDrop:KeepDropConfiguration? daro:TunnelsAndTrollsConfiguration? noSort:"ns"? {
    const configuration = keepDrop || {operator: null, value: null};
    configuration.noSort = noSort ? true: false;
    configuration.allSameAndExplode = daro ? true : false;
    return configuration;
  }

TunnelsAndTrollsConfiguration
  = which:("daro"/"aro"/"taro") {
    return which
  }

//Implementing Critrange here. Prevents user from doing drop/keeps and specifying a range at the same time. 
KeepDropConfiguration
  = which:(KeepConfiguration / DropConfiguration / KeepHighestConfiguration / KeepLowestConfiguration / DropHighestConfiguration / DropLowestConfiguration / Critrangeconfiguration) {
    return which; // these all return something of the format {operator: "kh"|"kl"|"dh"|"dl"|"c", value: integer}
  }

KeepConfiguration
  = operator:"k" value:Integer {
    return {
      operator: "kh",
      value: value.value,
    }
  }

KeepHighestConfiguration
  = operator:"kh" value:Integer {
    return {
      operator: "kh",
      value: value.value,
    }
  }

KeepLowestConfiguration
  = operator:"kl" value:Integer {
    return {
      operator: "kl",
      value: value.value,
    }
  }

DropConfiguration
  = operator:"d" value:Integer {
    return {
      operator: "dl",
      value: value.value,
    }
  }

DropHighestConfiguration
  = operator:"dh" value:Integer {
    return {
      operator: "dh",
      value: value.value,
    }
  }

DropLowestConfiguration
  = operator:"dl" value:Integer {
    return {
      operator: "dl",
      value: value.value,
    }
  }

Critrangeconfiguration
  = operator:"c" value:Integer {
    return {
      operator:"c",
      value: value.value,
    }
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
