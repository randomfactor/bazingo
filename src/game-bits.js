/**
 * Created by randall on 1/2/17.
 */

export class GameBits {

  constructor(bits) {
    this.bits = bits;
  }

  // val is 3x3. offsets relative to lower-right corner
  // offsets range from -1 to 3. it is possible for piece
  // to go beyond the board edge by one row or column
  test(val, offX, offY) {
    if (offX == -1 && (val & 0b001001001)) {
      return false;
    } else if (offX == 3 && (val & 0b100100100)) {
      return false;
    } else if (offY == -1 && (val & 0b000000111)) {
      return false;
    } else if (offY == 3 && (val & 0b111000000)) {
      return false;
    }

    // now safe to do shift test
    let shiftAmt = offY * 5 + offX;
    let piece5 = this.spreadPiece(val, shiftAmt);
    console.log(`piece5 bits: 0x${piece5.toString(16)}`);

    return !(piece5 & this.bits);
  }

  // modify board bits with piece dropped at coordinates
  // ensure that piece drop is safe before combining.
  combine(val, offX, offY) {
    if (!this.test(val, offX, offY)) {
      return false;
    }

    // now drop piece on board and set bits accordingly
    let shiftAmt = offY * 5 + offX;
    let piece5 = this.spreadPiece(val, shiftAmt);
    this.bits = piece5 | this.bits;
    console.log(`combined bits: 0x${this.bits.toString(16)}`);

    return this.bits;
  }

  // slice piece value and shift to align on board
  spreadPiece(val, shiftAmt) {
    let piece5 = ((val & 0x1c0) << 4) | ((val & 0x38) << 2) | (val & 0x7);
    piece5 = shiftAmt >= 1 ? piece5 << shiftAmt : piece5 >>> -shiftAmt;
    return piece5;
  }
}
