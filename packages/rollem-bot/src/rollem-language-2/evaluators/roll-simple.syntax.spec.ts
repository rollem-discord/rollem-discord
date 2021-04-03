import { expect } from 'chai';
import 'mocha';
import { RollemParserV2 } from '@language-v2/rollem-parser';
import { TestContext } from '@language-v2/types/context';
import { Dice } from '@language-v2/types';

const parser = new RollemParserV2()
describe('roll-simple (syntax)', () => {
  it('should handle single digits', () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("5d5");
    const value = delayedValue(ctx) as Dice;
    expect(ctx.callCount).to.equal(5);
    expect(value.value).to.equal(17);
    expect(value.values).to.eql([1, 3, 4, 4, 5]);
    expect(value.dice).to.equal(5);
    expect(value.depth).to.equal(2);
  });

  it('should handle multiple digits', () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("10d10");
    const value = delayedValue(ctx) as Dice;
    expect(ctx.callCount).to.equal(10);
    expect(value.value).to.equal(52);
    expect(value.values).to.eql([1, 2, 2, 5, 5, 6, 7, 7, 8, 9]);
    expect(value.dice).to.equal(10);
    expect(value.depth).to.equal(2);
  });

  it('should handle elided die count', () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("d10");
    const value = delayedValue(ctx) as Dice;
    expect(ctx.callCount).to.equal(1);
    expect(value.value).to.equal(5);
    expect(value.values).to.eql([5]);
    expect(value.dice).to.equal(1);
    expect(value.depth).to.equal(2);
  });
});