const Rollem  = require('../rollem.js');
const should = require('chai').should();


describe('Parsing - Basic Math', () => {
	it('parses 1+1', () => Rollem.tryParse('1+1').should.not.be.a('string'));
	it('parses 1-1', () => Rollem.tryParse('1-1').should.not.be.a('string'));
	it('parses 1+1-1', () => Rollem.tryParse('1+1-1').should.not.be.a('string'));

	it('parses 1/1', () => Rollem.tryParse('1/1').should.not.be.a('string'));
	it('parses 1/1/1', () => Rollem.tryParse('1/1/1').should.not.be.a('string'));
	it('parses 1*1*1', () => Rollem.tryParse('1*1*1').should.not.be.a('string'));

	// TODO: Test operator precedence.
});

describe('Parsing - Advanced Math', () =>{
	it('parses (1)', () => Rollem.tryParse('(1)').should.not.be.a('string'));
	it('parses (1+1)', () => Rollem.tryParse('(1+1)').should.not.be.a('string'));
});

describe('Parsing - Comparisons', () => {
	it('parses 5 < 4', () => Rollem.tryParse('5 < 4').should.not.be.a('string'));
	it('parses 5 <= 4', () => Rollem.tryParse('5 <= 4').should.not.be.a('string'));
	it('parses 5 >= 4', () => Rollem.tryParse('5 >= 4').should.not.be.a('string'));
	it('parses 5 > 4', () => Rollem.tryParse('5 > 4').should.not.be.a('string'));
	it('parses 5 = 4', () => Rollem.tryParse('5 = 4').should.not.be.a('string'));
});


// --


describe('Parsing - Basic Rolling', () => {
	it('parses d20', () => Rollem.tryParse('d20').should.not.be.a('string'));
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

describe('Parsing - Compound Rolling', () => {
	it('parses 1d20+1d6!+5', () => Rollem.tryParse('1d20+1d6+5').should.not.be.a('string'));
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


// --


describe('Parsing - Limitations', () => {
	it('accepts d2', () => Rollem.tryParse('d2').should.not.be.a('string'));
	it('rejects d1', () => Rollem.tryParse('d1').should.equal('Minimum die size is 2.'));
	it('rejects 1d1', () => Rollem.tryParse('1d1').should.equal('Minimum die size is 2.'));

	it('accepts 100d2', () => Rollem.tryParse('100d2').should.not.be.a('string'));
	it('rejects 101d2', () => Rollem.tryParse('101d2').should.equal('Maximum die count is 100.'));
});