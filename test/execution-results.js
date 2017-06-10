"use strict";

const Rollem = require('../rollem.js');
const should = require('chai').should();

RollemHooks = require('../grammar/RollemHooks.js').configurations.default;

function applyReturnNextRollEvaluator(returnNext) {
	RollemHooks.rollEvaluator = function (size, explode) {
		var value = returnNext.shift();
		return value;
	};
}

describe('Execution - Results Tests', () => {
	beforeEach(() => {
		RollemHooks = require('../grammar/RollemHooks.js').configurations.default;
		applyReturnNextRollEvaluator([[1], [2]])
	});

	it('evaluates d2', () => {
		let tree = Rollem.tryParse('d2');
		let evaluated = tree.result.evaluate();
		evaluated.should.have.property('value', 1);
	});
	it('evaluates 2d2', () => Rollem.tryParse('2d2').should.have.property('value', 1));
});