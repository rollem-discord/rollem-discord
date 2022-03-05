import { expect } from 'chai';
import 'mocha';
import { Dice, RollemParserV2, TestContext } from '../../..';

const parser = new RollemParserV2()
describe('roll-explode (syntax)', () => {
  it('should work', () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("5d5!");
    const value = delayedValue(ctx) as Dice;
    expect(ctx.callCount).to.equal(6);
    expect(value.value).to.equal(18);
    expect(value.values).to.eql([1, 1, 3, 4, 4, 5]);
    expect(value.dice()).to.equal(6);
    expect(value.depth()).to.equal(3);
  });
});