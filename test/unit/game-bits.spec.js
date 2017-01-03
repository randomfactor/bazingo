/**
 * Created by randall on 1/2/17.
 */
import {GameBits} from 'game-bits';

describe('the GameBits module', () => {
  it ('detects no collision on empty board when piece is in middle', () => {
    let sut = new GameBits(0x0);
    expect(sut.test(0b101010101, 1, 1)).toBeTruthy('piece in middle of board should not fail');
  });
  it('detects out-of-bounds in right col', () => {
    let sut = new GameBits(0x0);
    expect(sut.test(0b011010010, -1, 1)).toBeFalsy('right col out-of-bounds did not fail');
  });
  it ('detects out-of-bounds in left col', () => {
    let sut = new GameBits(0x0);
    expect(sut.test(0b110010010, 3, 1)).toBeFalsy('left col out-of-bounds did not fail');
  });
  it ('detects out-of-bounds in bottom row', () => {
    let sut = new GameBits(0x0);
    expect(sut.test(0b000111010, 1, -1)).toBeFalsy('bottom row out-of-bounds did not fail');
  });
  it('detects out-of-bounds in top row', () => {
    let sut = new GameBits(0x0);
    expect(sut.test(0b010111000, 1, 3)).toBeFalsy('top row out-of-bounds did not fail');
  });
  it('lets "key" fit in "lock"', () => {
    let sut = new GameBits(0b0000001110010100000000000);
    expect(sut.test(0b010111000, 1, 0)).toBeTruthy('"key" fits in "lock" in board center');
  });
  it('creates a 9x9 block when "key" placed in "lock"', () => {
    let sut = new GameBits(0b0000001110010100000000000);
    expect(sut.combine(0b010111000, 1, 0)).toBe(0x739c0, 'did not create 9x9 block in board center');
  });
});
