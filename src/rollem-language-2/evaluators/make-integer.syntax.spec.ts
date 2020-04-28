import { expect } from 'chai';
import 'mocha';
import { makeInteger } from './make-integer';
import { RollemParserV2 } from '@language-v2/rollem-parser';

const parser = new RollemParserV2()
describe('make-integer (syntax)', () => {
  it('should handle single digits', () => {
    const delayedValue = parser.parse("5");
    const value = delayedValue();
    expect(value.value).to.equal(5);
    expect(value.values).to.eql([5]);
    expect(value.pretties).to.equal("5");
    expect(value.dice).to.equal(0);
    expect(value.depth).to.equal(1);
  });

  it('should handle multiple digits', () => {
    const delayedValue = parser.parse("5");
    const value = delayedValue();
    expect(value.value).to.equal(189465);
    expect(value.values).to.eql([189465]);
    expect(value.pretties).to.equal("189465");
    expect(value.dice).to.equal(0);
    expect(value.depth).to.equal(1);
  });

  it('should handle negative numbers', () => {
    const delayedValue = parser.parse("5");
    const value = delayedValue();
    expect(value.value).to.equal(-189465);
    expect(value.values).to.eql([-189465]);
    expect(value.pretties).to.equal("-189465");
    expect(value.dice).to.equal(0);
    expect(value.depth).to.equal(1);
  });
});