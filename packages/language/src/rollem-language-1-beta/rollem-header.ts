import { randomInt } from "crypto";

declare function error(message: string, location: any);

// this avoids a typing issue
export { }

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
function maxEvaluator(size) {
  return size;
}
function minEvaluator(size) {
  return 1;
}
function rollEvaluator(size, explodeConfiguration?: { value: number, operator: string }) {
  var all_rolls: number[] = [];
  var minimumExplodeSize =
    explodeConfiguration && explodeConfiguration.value
      ? explodeConfiguration.value
      : size;
  if (minimumExplodeSize <= 1) {
    error("Explode value must be greater than 1.", "CUSTOM");
  }
  if (minimumExplodeSize < size / 1000) {
    error("Explode chance must be less than 99.9%", "CUSTOM");
  }
  if (explodeConfiguration && explodeConfiguration.operator === "oe") {
    var minimumExplodeUpSize = Math.ceil(size * 0.95) + 1;
    var maximumExplodeDownSize = Math.ceil(size * 0.05) + 1;
    var sign = 1;
    do {
      var last_roll = Math.floor(Math.random() * size) + 1;
      // first roll
      if (all_rolls.length == 0 && last_roll <= maximumExplodeDownSize) {
        sign = -1;
        all_rolls.push(last_roll);
        last_roll = size;
      } else {
        all_rolls.push(sign * last_roll);
      }
    } while (last_roll >= minimumExplodeUpSize && explodeConfiguration);
  } else {
    do {
      var last_roll = randomInt(size)+1;
      all_rolls.push(last_roll);
    } while (last_roll >= minimumExplodeSize && explodeConfiguration);
  }
  return all_rolls;
}

type EvaluatorT = (i: any) => boolean;
function makeCounter(left, expr, right) {
  var evaluator: EvaluatorT = (i: any) => { throw new Error("No evaluator set."); }
  switch (expr) {
    case "<<":
      evaluator = function (v) {
        return v <= right.value;
      };
      break;
    case ">>":
      evaluator = function (v) {
        return v >= right.value;
      };
      break;
  }

  var count = 0;
  left.values.forEach(function (v, i, arr) {
    if (evaluator(v)) {
      count++;
    }
  });

  return {
    value: count,
    values: [count],
    pretties: left.pretties + " " + expr + " " + right.pretties,
    depth: Math.max(left.depth, right.depth) + 1,
    dice: left.dice + right.dice,
  };
}

function makeInteger(text) {
  var value = parseInt(text, 10);
  return {
    value: value,
    values: [value],
    pretties: text,
    depth: 1,
    dice: 0,
  };
}

// TODO: generalize roll structure
function makeFateRoll(left) {
  var size = 3;
  var count = left ? left.value : 1;
  if (count > 100) {
    error("Maximum die count is 100.", "CUSTOM");
  }
  var valuesArr: number[] = [];

  // roll
  for (var i = 0; i < count; i++) {
    var newVals = singleDieEvaluator(size);
    Array.prototype.push.apply(valuesArr, newVals);
  }

  // map d3 to -1 0 1
  valuesArr = valuesArr.map((v) => v - 2);

  // total
  var accumulator = 0;
  valuesArr.forEach(function (v, i, arr) {
    accumulator += v;
  });

  // make pretties int - 0 +
  var prettiesArr = valuesArr
    .sort((a, b) => a - b)
    .reverse()
    .map(function (v, i, arr) {
      switch (v) {
        case 0:
          return "0";
        case 1:
          return "+";
        case -1:
          return "-";
        default:
          return "broken";
      }
    });

  var pretties = "[" + prettiesArr.join(", ") + "]" + count + "dF";

  valuesArr = valuesArr.sort((a, b) => a - b);
  var depth = left ? left.depth + 1 : 2;
  var dice = left ? left.value : 1;
  return {
    value: accumulator,
    values: valuesArr,
    pretties: pretties,
    depth: depth,
    dice: dice,
  };
}

function makeBasicRoll(left, right, explodeConfiguration, configuration) {
  var size = right.value;
  var count = left ? left.value : 1;
  var allSameAndExplode = configuration.allSameAndExplode;
  var noSort = configuration.noSort || allSameAndExplode;
  var keepDropOperator = configuration.operator;
  var keepDropValue = clamp(configuration.value || 0, 0, count);

  if (size <= 1) {
    error("Minimum die size is 2.", "CUSTOM");
  }
  if (count > 100) {
    error("Maximum die count is 100.", "CUSTOM");
  }

  var valuesArr = [];

  // roll
  for (var i = 0; i < count; i++) {
    var newVals = singleDieEvaluator(size, explodeConfiguration);
    Array.prototype.push.apply(valuesArr, newVals);
  }

  // allSameAndExplode
  if (allSameAndExplode && valuesArr.length >= 2) {
    var allSame = valuesArr.every((v) => v == valuesArr[0]);
    while (allSame) {
      var newVals = singleDieEvaluator(size, explodeConfiguration);
      allSame = newVals.every((v) => v == valuesArr[0]);
      Array.prototype.push.apply(valuesArr, newVals);
    }
  }

  // handle keep-drop
  var augmentedValuesArr = valuesArr.map((v) => {
    return { value: v, isKept: false };
  });
  var sortedAugmentedValuesArr = Array.from(augmentedValuesArr)
    .sort((a, b) => a.value - b.value)
    .reverse();
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
      keepRangeEndExclusive = sortedAugmentedValuesArr.length - keepDropValue;
      break;
    case "c":
      critrange = configuration.value;
      keepDropValue = critrange;
      break;
    default:
      // leave it at the default (keep everything)
      break;
  }

  sortedAugmentedValuesArr
    .slice(keepRangeStart, keepRangeEndExclusive)
    .forEach((v) => (v.isKept = true));

  // total
  var accumulator = 0;
  augmentedValuesArr
    .filter((v) => v.isKept)
    .forEach((v, i, arr) => (accumulator += v.value));

  // format
  var formatOrder = noSort ? augmentedValuesArr : sortedAugmentedValuesArr;
  var prettiesArr = formatOrder.map((v, i, arr) => {
    //critrange is by default = to size
    return dieFormatter(v.value, critrange, v.isKept);
  });

  var pretties =
    "[" + prettiesArr.join(", ") + "]" + count + "d" + right.pretties;
  if (explodeConfiguration) {
    if (explodeConfiguration.operator === "oe") {
      pretties = pretties + "oe";
    } else {
      pretties = pretties + "!";
      if (explodeConfiguration.value) {
        pretties = pretties + explodeConfiguration.value;
      }
    }
  }

  if (keepDropOperator) {
    pretties = pretties + keepDropOperator + keepDropValue;
  }

  valuesArr = sortedAugmentedValuesArr
    .filter((v) => v.isKept)
    .map((v) => v.value);
  var depth = left ? Math.max(left.depth, right.depth) + 1 : right.depth + 1;
  var dice = left ? left.value : 1;
  return {
    value: accumulator,
    values: valuesArr,
    pretties: pretties,
    depth: depth,
    dice: dice,
  };
}

// This is used to configure how the dice calculations are performed.
var singleDieEvaluator = rollEvaluator;

// This is used to configure stylization of the individual die results.
function dieFormatter(value, size, isKept = true) {
  var formatted = value;
  if (value >= size) formatted = maxFormatter(formatted);
  else if (value == 1) formatted = minFormatter(formatted);

  if (!isKept) formatted = dropFormatter(formatted);

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

function makeBurningWheelNumber(left) {
  switch (left) {
    case "B":
      return makeInteger("4");
      break;
    case "G":
      return makeInteger("3");
      break;
    case "W":
      return makeInteger("2");
      break;
  }
}
