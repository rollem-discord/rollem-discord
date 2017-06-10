"use strict";

// Types:
//   integer

// Object Format:
// {
//   type = "integer"
//   value = 27,
//   values = [ value1, value2, value3 ],
//   pretties = "[value1, value2, **value3**]",
//   label = "Anything you want",
//   dice = 0
// }

function UserError(message, location) {
	this.message = message;
	this.location = location;
	this.name = 'UserException';
}

var error = (message, location) => { throw new UserError(message, location); };

// TODO: Convert to typescript
let Domain = {
	Integral: "integral",
	Real: "real"
};

let Type = {
	Simple: "simple",
	Dice: "dice"
};

exports = module.exports = {};

exports.rollEvaluators = {};
exports.rollEvaluators.max = (size, explode) => size;
exports.rollEvaluators.min = (size, explode) => 1;
exports.rollEvaluators.roll = (size, explode) => {
	let all_rolls = [],
		last_roll = 0;

	do {
		last_roll = Math.floor(Math.random() * size) + 1;
		all_rolls.push(last_roll);
	} while (last_roll === size && explode);

	debugger;

	return all_rolls;
};


exports.configurations = {};

exports.configurations.default = {
	rollEvaluator: exports.rollEvaluators.roll
};

exports.configurations.default.make = {};
exports.configurations.default.make.basicRoll = (dieCount, dieSize) => {
	if (!dieSize) { error("No die size provided.", "CUSTOM"); }
	if (dieCount.domain !== Domain.Integral) { error("Cannot roll non-integer die counts.", "CUSTOM"); }
	if (dieSize.domain !== Domain.Integral) { error("Cannot roll non-integer die sizes.", "CUSTOM"); }
};

exports.configurations.default.make.simpleRoll = (dieSizeRaw) => {
	if (!dieSizeRaw) { error("No die size provided."); }
	if (dieSizeRaw.domain !== Domain.Integral) { error("Cannot roll non-integer die sizes.", "CUSTOM"); }
	let depth = dieSizeRaw.depth + 1;
	let dice = dieSizeRaw.dice + 1;

	let evaluator = () => {
		let dieSize = dieSizeRaw.evaluate();
		let values = exports.configurations.current.rollEvaluator(dieSize, false);
		debugger;

		let value = values.reduce(((x,y) => x+y), 0);
		return {
			value: value,
			values: values,
			pretties: "[" + values.join(", ") + "]d" + dieSize.value
		};
	};

	return {
		domain: Domain.Integral,
		type: Type.Dice,
		trace: "(d" + dieSizeRaw.trace + ")",
		depth: depth,
		dice: dice,
		evaluate: evaluator
	};
};

exports.configurations.default.make.integer = (text) => {
	let value = parseInt(text, 10);
	let evaluator = () => {
		return {
			value: value,
			values: [value],
			pretties: "" + value
		}
	};

	return {
		type: Type.Simple,
		domain: Domain.Integral,
		trace: "(" + value + ")",
		depth: 1,
		dice: 0,
		evaluate: evaluator
	};
};

exports.configurations.default.make.string = (text) => {
	return text; // TODO
};

exports.configurations.current = exports.configurations.default;