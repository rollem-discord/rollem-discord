const Rollem  = require('../rollem.js');
const should = require('chai').should();


describe('Parsing - Compound Rolling', () => {
	it('parses 1d20+1d6!+5', () => Rollem.tryParse('1d20+1d6+5').should.not.be.a('string'));
});
