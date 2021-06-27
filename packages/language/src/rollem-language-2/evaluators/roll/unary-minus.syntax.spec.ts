import { expect } from 'chai';
import 'mocha';
import { Dice, RollemParserV2, TestContext, Value } from '../../..';

const parser = new RollemParserV2()
describe('unary-minus (syntax)', () => {
  it('should handle chains', () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("---10");
    const value = delayedValue(ctx) as Value;
    expect(ctx.callCount).to.equal(0);
    expect(value.value).to.equal(-10);
    expect(value.dice()).to.equal(0);
    expect(value.depth()).to.equal(3);
  });

  it('should handle negative elided die count', () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("-d10");
    const value = delayedValue(ctx) as Dice;
    expect(ctx.callCount).to.equal(1);
    expect(value.value).to.equal(-5);
    expect(value.values).to.eql([-5]);
    expect(value.pretties).to.equal("[-5] ⟵ -([5] ⟵ 1d10)");
    expect(value.dice()).to.equal(1);
    expect(value.depth()).to.equal(3);
  });
});