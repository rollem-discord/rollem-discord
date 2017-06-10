const Rollem  = require('../rollem.js');
const should = require('chai').should();


describe('Parsing - Basic Rolling', () => {
	it('parses d20', () => Rollem.tryParse('d20').trace.should.be("(d(20)"));
	it('parses 5d20', () => Rollem.tryParse('5d20').should.not.be.a('string'));

	it('parses d6', () => Rollem.tryParse('d6').should.not.be.a('string'));
	it('parses 5d6', () => Rollem.tryParse('5d6').should.not.be.a('string'));

	it('parses d6!', () => Rollem.tryParse('d6!').should.not.be.a('string'));
	it('parses 5d6!', () => Rollem.tryParse('5d6!').should.not.be.a('string'));
});

describe('Parsing - Dice Counting', () => {
	it('parses d20 >> 1', () => Rollem.tryParse('d20 >> 1').should.not.be.a('string'));
	it('parses 5d20 >> 1', () => Rollem.tryParse('5d20 >> 1').should.not.be.a('string'));

	it('parses d20 << 1', () => Rollem.tryParse('d20 << 1').should.not.be.a('string'));
	it('parses 5d20 << 1', () => Rollem.tryParse('5d20 << 1').should.not.be.a('string'));
});

describe('Parsing - Burning Wheel Notation', () => {
	it('parses B5', () => Rollem.tryParse('B5').should.not.be.a('string'));
	it('parses G6', () => Rollem.tryParse('G6').should.not.be.a('string'));
	it('parses W6', () => Rollem.tryParse('W1').should.not.be.a('string'));

	it('parses B5!', () => Rollem.tryParse('B5!').should.not.be.a('string'));
	it('parses G6!', () => Rollem.tryParse('G6!').should.not.be.a('string'));
	it('parses W6!', () => Rollem.tryParse('W1!').should.not.be.a('string'));
});

describe('Parsing - Fate Notation', () => {
	it('parses dF', () => Rollem.tryParse('4dF').should.not.be.a('string'));
	it('parses 4dF', () => Rollem.tryParse('4dF').should.not.be.a('string'));
});