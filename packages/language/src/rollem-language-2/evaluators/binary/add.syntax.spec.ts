import { expect } from "chai";
import "mocha";
import { Dice, RollemParserV2, TestContext, Value } from "../../..";

const parser = new RollemParserV2();
describe("add (syntax)", () => {
  it("should handle integers (under 10)", () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("5 + 4");
    debugger;
    const value = delayedValue(ctx) as Value;
    expect(ctx.callCount).to.equal(0);
    expect(value.value).to.equal(9);
    expect(value.dice()).to.equal(0);
    expect(value.depth()).to.equal(2);
  });

  it("should handle integers (over 10)", () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("15 + 14");
    debugger;
    const value = delayedValue(ctx) as Value;
    expect(ctx.callCount).to.equal(0);
    expect(value.value).to.equal(29);
    expect(value.dice()).to.equal(0);
    expect(value.depth()).to.equal(2);
  });

  it("should handle longer chains", () => {
    const ctx = new TestContext("test");
    const delayedValue = parser.parse("10 + 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 + 0");
    debugger;
    const value = delayedValue(ctx) as Value;
    expect(ctx.callCount).to.equal(0);
    expect(value.value).to.equal(55);
    expect(value.dice()).to.equal(0);
    expect(value.depth()).to.equal(11);
  });
});
