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

export class GameLogMessage {
  constructor(msg) {
    this.msg = msg;
  }

  toString() {
    return `Message [${new Date().toLocaleString()}]: ${this.msg}`;
  }
}
