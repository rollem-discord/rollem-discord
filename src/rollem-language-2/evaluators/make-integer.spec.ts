import { expect } from 'chai';
import 'mocha';
import { makeInteger } from './make-integer';

describe('make-integer', () => {
  it('should handle single digits', () => {
    const delayedValue = makeInteger("5");
    const value = delayedValue();
    expect(value.value).to.equal(5);
    expect(value.values).to.eql([5]);
    expect(value.pretties).to.equal("5");
    expect(value.dice).to.equal(0);
    expect(value.depth).to.equal(1);
  });

  it('should handle multiple digits', () => {
    const delayedValue = makeInteger("189465");
    const value = delayedValue();
    expect(value.value).to.equal(189465);
    expect(value.values).to.eql([189465]);
    expect(value.pretties).to.equal("189465");
    expect(value.dice).to.equal(0);
    expect(value.depth).to.equal(1);
  });

  it('should handle negative numbers', () => {
    const delayedValue = makeInteger("-189465");
    const value = delayedValue();
    expect(value.value).to.equal(-189465);
    expect(value.values).to.eql([-189465]);
    expect(value.pretties).to.equal("-189465");
    expect(value.dice).to.equal(0);
    expect(value.depth).to.equal(1);
  });
});