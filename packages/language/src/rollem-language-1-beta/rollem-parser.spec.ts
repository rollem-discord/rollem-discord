import { expect } from 'chai';
import 'mocha';
import { RollemParserV1Beta } from './rollem-parser';

describe('rollem-language-1-beta', () => {
  it('should handle single digits', () => {
    const parser = new RollemParserV1Beta();
    const result = parser.parse('5');
    expect(result.value).to.equal(5);
    expect(result.pretties).to.equal("5");
    expect(result.depth).to.equal(1);
    expect(result.dice).to.equal(0);
  });

  it('should handle multiple digits', () => {
    const parser = new RollemParserV1Beta();
    const result = parser.parse('1234567890');
    expect(result.value).to.equal(1234567890);
    expect(result.pretties).to.equal("1234567890");
    expect(result.depth).to.equal(1);
    expect(result.dice).to.equal(0);
  });

  it('should handle elided dice', () => {
    const parser = new RollemParserV1Beta();
    const result = parser.parse('d20');
    console.log(result);
    expect(result.pretties.endsWith('d20'))
    expect(result.depth).to.equal(2);
    expect(result.dice).to.equal(1);
  });

  it('should handle dice', () => {
    const parser = new RollemParserV1Beta();
    const result = parser.parse('2d20');
    console.log(result);
    expect(result.pretties.endsWith('2d20'))
    expect(result.depth).to.equal(2);
    expect(result.dice).to.equal(2);
  });

  it('should handle keep-drop dice', () => {
    const parser = new RollemParserV1Beta();
    const result = parser.parse('2d20k1');
    console.log(result);
    expect(result.pretties.endsWith('2d20k1'))
    expect(result.depth).to.equal(2);
    expect(result.dice).to.equal(2);
  });
});