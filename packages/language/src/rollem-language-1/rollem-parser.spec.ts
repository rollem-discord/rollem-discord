import { expect } from 'chai';
import 'mocha';
import { RollemParserV1 } from './rollem-parser';

describe('rollem-language-1', () => {
  it('should handle single digits', () => {
    const parser = new RollemParserV1();
    const result = parser.parse('5');
    expect(result.value).to.equal(5);
    expect(result.pretties).to.equal("5");
    expect(result.depth).to.equal(1);
    expect(result.dice).to.equal(0);
  });

  it('should handle multiple digits', () => {
    const parser = new RollemParserV1();
    const result = parser.parse('1234567890');
    expect(result.value).to.equal(1234567890);
    expect(result.pretties).to.equal("1234567890");
    expect(result.depth).to.equal(1);
    expect(result.dice).to.equal(0);
  });

  it('should handle elided dice', () => {
    const parser = new RollemParserV1();
    const result = parser.parse('d20');
    console.log(result);
    expect(result.pretties.endsWith('d20'))
    expect(result.depth).to.equal(2);
    expect(result.dice).to.equal(1);
  });

  it('should handle dice', () => {
    const parser = new RollemParserV1();
    const result = parser.parse('2d20');
    console.log(result);
    expect(result.pretties.endsWith('2d20'))
    expect(result.depth).to.equal(2);
    expect(result.dice).to.equal(2);
  });

  it('should handle keep-drop dice', () => {
    const parser = new RollemParserV1();
    const result = parser.parse('2d20k1');
    console.log(result);
    expect(result.pretties.endsWith('2d20k1'))
    expect(result.depth).to.equal(2);
    expect(result.dice).to.equal(2);
  });

  it('should keep roll order with ns when using ++', () => {
    // ns rolls are random, so over many trials the unsorted display must not always be sorted descending
    const parser = new RollemParserV1();
    let sawUnsorted = false;
    for (let i = 0; i < 50 && !sawUnsorted; i++) {
      const result = parser.parse('3d6ns ++ 0');
      const shown = result.pretties.slice(1, result.pretties.indexOf(']')).split(', ').map(Number);
      const sorted = [...shown].sort((a, b) => b - a);
      if (shown.join(',') !== sorted.join(',')) {
        sawUnsorted = true;
      }
    }
    expect(sawUnsorted).to.equal(true);
  });
});