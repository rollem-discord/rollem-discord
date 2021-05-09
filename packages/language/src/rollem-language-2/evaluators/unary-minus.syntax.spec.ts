import { expect } from 'chai';
import 'mocha';
import { RollemParserV2 } from '@language-v2/rollem-parser';
import { TestContext } from '@language-v2/types/context';
import { Dice, Value } from '@language-v2/types';

const parser = new RollemParserV2()
describe('unary-minus (syntax)', () => {
  it('should handle chains', () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("---10");
    const value = delayedValue(ctx) as Value;
    expect(ctx.callCount).to.equal(0);
    expect(value.value).to.equal(-10);
    expect(value.dice()).to.equal(0);
    expect(value.depth()).to.equal(4);
  });

  it('should handle inverted die rolls', () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("-10d10");
    const value = delayedValue(ctx) as Dice;
    expect(ctx.callCount).to.equal(10);
    expect(value.value).to.equal(-52);
    expect(value.values).to.eql([-1, -2, -2, -5, -5, -6, -7, -7, -8, -9]);
    expect(value.dice()).to.equal(10);
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