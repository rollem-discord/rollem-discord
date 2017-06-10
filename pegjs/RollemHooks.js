"use strict";


// Object Format:
// {
//   value = 27,
//   values = [ value1, value2, value3 ],
//   pretties = "[value1, value2, **value3**]",
//   label = "Anything you want",
//   dice = 0
// }


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

