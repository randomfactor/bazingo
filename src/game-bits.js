/**
 * Created by randall on 1/2/17.
 */

export class GameBits {

  constructor(bits) {
    this.bits = bits;
  }

  set(val) {
    this.bits = val;
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
    //console.log(`piece5 bits: 0x${piece5.toString(16)}`);

    return !(piece5 & this.bits);
  }

  // modify board bits with piece dropped at coordinates
  // ensure that piece drop is safe before combining.
  combine(val, offX, offY) {
    if (this.test(val, offX, offY)) {
      // now drop piece on board and set bits accordingly
      let shiftAmt = offY * 5 + offX;
      let piece5 = this.spreadPiece(val, shiftAmt);
      this.bits = piece5 | this.bits;
      //console.log(`combined bits: 0x${this.bits.toString(16)}`);
    }

    return this.bits;
  }

  // slice piece value and shift to align on board
  spreadPiece(val, shiftAmt) {
    let piece5 = ((val & 0x1c0) << 4) | ((val & 0x38) << 2) | (val & 0x7);
    piece5 = shiftAmt >= 1 ? piece5 << shiftAmt : piece5 >>> -shiftAmt;
    return piece5;
  }

  // recursive method to find blocks, score them, and remove them from board
  scoreBlocks(score) {
    let r1x2 = this.bits & this.rightShift(this.bits);
    let r2x2 = r1x2 & this.downShift(r1x2);
    if (r2x2 != 0) {
      let r3x2 = r2x2 & this.downShift(r2x2);
      let r2x3 = r2x2 & this.rightShift(r2x2);
      let r3x3 = r3x2 & this.rightShift(r3x2);

      if (r3x3 != 0) {
        this.bits = this.bits ^ (this.lsb(r3x3) * 0x1ce7);
        return this.scoreBlocks(score + 45);
      } else if (r2x3 != 0) {
        this.bits = this.bits ^ (this.lsb(r2x3) * 0xe7);
        return this.scoreBlocks(score + 18);
      } else if (r3x2 != 0) {
        this.bits = this.bits ^ (this.lsb(r3x2) * 0xc63);
        return this.scoreBlocks(score + 18);
      } else {
        this.bits = this.bits ^ (this.lsb(r2x2) * 0x63);
        return this.scoreBlocks(score + 4);
      }
    } else {
      return score;   // recursion complete
    }
  }

  rightShift(bits) { return (bits >> 1) & 0x0f7bdef; }
  downShift(bits) { return (bits >> 5); }
  lsb(bits) { return bits - (bits & (bits - 1)); }
}
