import { expect } from "chai";
import "mocha";
import { Dice, RollemParserV2, TestContext, Value } from "../../..";

const parser = new RollemParserV2();

function shouldHandle(evalExpression: string): void {
  it(`should handle ${evalExpression}`, () => {
    const expectedResult = eval(evalExpression);
    const ctx = new TestContext("test");
    const delayedValue = parser.parse(evalExpression);
    debugger;
    const value = delayedValue(ctx) as Value;
    expect(ctx.callCount).to.equal(0);
    expect(value.value).to.equal(expectedResult);
    expect(value.dice()).to.equal(0);
  });
}

describe("binary (syntax)", () => {
  shouldHandle("5 * 4 - 2")
  shouldHandle("5 * 4 / 2")
  shouldHandle("-10 - 1 - 1- 1 -1")
  shouldHandle("-10 / 2")
  shouldHandle("10 / -2")
  shouldHandle("5 / 4 * 100")
  shouldHandle("1 + 2 * 3 - 1")
});
