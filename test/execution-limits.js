const Rollem  = require('../rollem.js');
const should = require('chai').should();


describe('Execution - Limits', () => {
	it('accepts d2', () => Rollem.tryParse('d2').should.not.be.a('string'));
	it('rejects d1', () => Rollem.tryParse('d1').should.equal('Minimum die size is 2.'));
	it('rejects 1d1', () => Rollem.tryParse('1d1').should.equal('Minimum die size is 2.'));

	it('accepts 100d2', () => Rollem.tryParse('100d2').should.not.be.a('string'));
	it('rejects 101d2', () => Rollem.tryParse('101d2').should.equal('Maximum die count is 100.'));
});