{
  // see ./rollem-header.ts and gulpfile.js for how imports are handled
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

      let counterRight = makeBurningWheelNumber(left);
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
