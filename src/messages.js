/**
 * Created by randall on 1/2/17.
 */

export class GamePieceSnap {
  constructor(indX, indY, posX, posY) {
    this.indX = indX;
    this.indY = indY;
    this.posX = posX;
    this.posY = posY;
  }

  toString() {
    return `Snap: [${this.indX}, ${this.indY}] (${this.posX}, ${this.posY})`
  }
}

export class GameDropReject {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
  }

  toString() {
    return `Reject: (${this.posX}, ${this.posY})`;
  }
}

export class GamePieceLock {
  constructor(posX, posY, pieceVal) {
    this.posX = posX;
    this.posY = posY;
    this.pieceVal = pieceVal;
  }
}

export class GameMove {
  constructor(x, y) {
    this.X = x;
    this.Y = y;
  }
}

export class GameLogMessage {
  constructor(msg) {
    this.msg = msg;
  }

  toString() {
    return `Message [${new Date().toLocaleString()}]: ${this.msg}`;
  }
}
