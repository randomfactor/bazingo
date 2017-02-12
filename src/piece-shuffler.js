/**
 * Created by randall on 2/12/17.
 */


export class PieceShuffler {
  getRandomPieces(count) {
    let retval = PieceShuffler._allPieces;
    retval = this.shuffle(retval);
    return retval.slice(0, count);
  }

  // https://bost.ocks.org/mike/shuffle/
  shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  static get _allPieces() {
    return [
      0o20, 0o30, 0o220, 0o420, 0o120,                        // onesies, twosies
      0o260, 0o230, 0o62, 0o32,                               // corners
      0o70, 0o222, 0o421, 0o124,                              // three in row
      0o360, 0o630, 0o132, 0o231,                             // shifts
      0o262, 0o270, 0o232, 0o72,                              // keys
      0o622, 0o322, 0o226, 0o223, 0o470, 0o74, 0o170, 0o71,   // ells
      0o570, 0o75, 0o626, 0o323,                              // locks
      0o525, 0o272                                            // checkerboard, cross
    ];
  }
}
