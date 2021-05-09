import { expect } from 'chai';
import 'mocha';
import { RollemParserV2 } from '@language-v2/rollem-parser';
import { TestContext } from '@language-v2/types/context';

const parser = new RollemParserV2()
describe('make-integer (syntax)', () => {
  it('should handle single digits', () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("5");
    const value = delayedValue(ctx);
    expect(ctx.callCount).to.equal(0);
    expect(value.value).to.equal(5);
    expect(value.pretties).to.equal("5");
    expect(value.dice()).to.equal(0);
    expect(value.depth()).to.equal(1);
  });

  const context = new TestContext("test");
  it('should handle multiple digits', () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("189465");
    const value = delayedValue(ctx);
    expect(ctx.callCount).to.equal(0);
    expect(value.value).to.equal(189465);
    expect(value.pretties).to.equal("189465");
    expect(value.dice()).to.equal(0);
    expect(value.depth()).to.equal(1);
  });

  it('should handle negative numbers', () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("-189465");
    const value = delayedValue(ctx);
    expect(ctx.callCount).to.equal(0);
    expect(value.value).to.equal(-189465);
    expect(value.pretties).to.equal("-189465");
    expect(value.dice()).to.equal(0);
    expect(value.depth()).to.equal(2);
  });
});