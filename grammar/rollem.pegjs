/*
 * Die Roll Evaluator
 * By @Lemtzas September 2016
 * License: MIT. At bottom..
 *
 * Standard functions: XdY dY / * + - ()
 *
 * Special functions:
 * XdY! - exploding dice. If you roll max, the die will be rerolled and added to your total.
 * XdY << Z - Counts the number of dice lower than or equal to Z. Operates on the die list.
 * XdY >> Z - Counts the number of dice greater than or equal to Z. Operates on the die list.
 * 4d60 Anything you want - Labels the roll with "Anything you want"
 *
 * Comparison functions:
 * < <= > >= = ==
 * These operate on value totals and return a success/failure state.
 *
 * Some examples (Plug into http://pegjs.org/online for a quick test):
 * d20
 * 2d20
 * (8d6 + 4d3 / 4) * d2
 * d6 > 2
 * 20d6 >> 4 > 2
 * 20d6 > 20d6
 * 6d6!
 *
 **/
 {
 	// Object Format:
    // {
    //   value = 27,
    //   values = [ value1, value2, value3 ],
    //   pretties = "[value1, value2, **value3**]",
    //   label = "Anything you want"
    // }
 	function maxEvaluator(size) { return size; }
 	function minEvaluator(size) { return 1; }
 	function rollEvaluator(size, explode) {
      var all_rolls = [];
      do {
        var last_roll = Math.floor(Math.random() * size) + 1;
        all_rolls.push(last_roll);
      } while (last_roll == size && explode)
      return all_rolls;
    }

    // This is used to configure how the dice calculations are performed.
    var singleDieEvaluator = rollEvaluator;

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
  = result: Comparator _? label:(Garbage)?{
    result.label = label;
    result.values = [result.value];
    return result;
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
      if (wasSuccess) {
        return {
          "value": true,
          "values": [1],
          "pretties": withValue,
          "depth": Math.max(left.depth, right.depth) + 1
        };
      } else {
        return {
          "value": false,
          "values": [0],
          "pretties": withValue,
          "depth": Math.max(left.depth, right.depth) + 1
        };
      }
    }
    / Counter
    / Expression

Counter
  = left:Expression _ expr:( "<<" / ">>" ) _ right:Expression {
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
        "depth": Math.max(left.depth, right.depth) + 1
      };
    }
    / Expression

Expression
  = left:Term right:(_ ("+" / "-") _ Term)* {
      var result = left, i;

      for (i = 0; i < right.length; i++) {
        var current = right[i][3];
        result.depth = Math.max(result.depth, current.depth + 1)
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
        result.depth = Math.max(result.depth, current.depth + 1)
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
  / Roll
  / Integer

Roll
  = left:Integer? [dD] right:Integer explode:"!"? {
      var size = right.value;
      var count = left ? left.value : 1;
      if (size <= 1) { error("Minimum die size is 2.", "CUSTOM"); }
      if (count > 100) { error("Maximum die count is 100.", "CUSTOM"); }
      var values_arr = [];

      for (var i=0; i < count; i++)
      {
        var newVals = singleDieEvaluator(size, explode);
        Array.prototype.push.apply(values_arr, newVals);
      }

      var accumulator = 0;
      values_arr.forEach(function(v,i,arr) { accumulator += v; });

      var pretties_arr = values_arr.sort().reverse().map(function(v,i,arr) {
        return dieFormatter(v, size);
      });

      var pretties = "[" + pretties_arr.join(", ") + "]" + count + "d" + size;
      if (explode) { pretties = pretties + "!"; }

      values_arr = values_arr.sort();
      var depth = left ? Math.max(left.depth, right.depth)+1 : right.depth+1;
      return {
          "value": accumulator,
          "values": values_arr,
          "pretties": pretties,
          "depth": depth
      };
    }

Integer "integer"
  = [0-9]+ {
  		var value = parseInt(text(), 10);
  		return {
        	"value": value,
            "values": [ value ],
            "pretties": text(),
            "depth": 1
        };
   	}

_ "whitespace"
  = [ \t\n\r]*

Garbage "any characters"
 = [^]* {
 	return text();
 }

/**
 * Copyright (c) 2016 Lemtzas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/
