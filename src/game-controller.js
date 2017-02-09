/**
 * Created by randall on 2/8/17.
 */

import {inject} from 'aurelia-framework';
import {GameBits} from 'game-bits';

export class GameClockFactory {
  getCurrentTime() {
    return new Date();
  }
}

@inject(GameClockFactory)
export class GameController {
  constructor(gcf) {
    this.players = new Map();
    this.initialize();
    this.gcf = gcf;
  }

  initialize() {
    this.gs = {id: "practice", turn: -1, timeout: GameController._turnDur, startedAt: null};
    this.pieceOrder = [0o262, 0o323, 0o260, 0o62];  // TODO: randomize
  }

  join(playerId, nickName) {
    this.players[playerId] = {name: nickName, board: new GameBits(0), points: 0, moves: []};
  }

  getGameStateForPlayer(playerId) {
    let p = new Promise((resolve, reject) => {
      let now = this.gcf.getCurrentTime();
      this.checkNextTurn(now);

      let currentPiece = this.gs.turn >= 0 && this.gs.turn < this.pieceOrder.length ? this.pieceOrder[this.gs.turn] : 0;
      let preview = this.pieceOrder.slice(this.gs.turn + 1, this.gs.turn + 4);
      let gs = {roomId: "SinglePlayer", gameId: this.gs.id, gameTurn: this.gs.turn,
        turnTimer: (this.gs.timeout - (now.getTime() - this.gs.startedAt.getTime())),
        pieceVal: currentPiece, piecePreview: preview};

      resolve({gameState: gs, playerState: {}});
    });
    return p;
  }

  recordPlayerMove(playerId, turn, offsetX, offsetY) {
    // TODO: implement this.
  }
  /*

   Returns: gameState: {roomId, gameId, gameTurn, turnTimer, pieceVal, piecePreview: [pieceVal0, pieceVal1, ...]}
   playerState: {playerId, playerPts, boardVal}
   */

  checkNextTurn(now) {
    // init startedAt if this is the first check of game
    if (!this.gs.startedAt) {
      this.gs.startedAt = now;
    }

    // compute turn number and turn start time according to now parameter
    let curTime = now.getTime();
    let startTime = this.gs.startedAt.getTime();
    let turnDur = this.gs.timeout;
    if (curTime >= startTime + turnDur) {
      // it is time for a new turn; perhaps more than one
      let missedTurns = Math.floor((curTime - startTime) / turnDur);
      missedTurns = Math.min(missedTurns, this.pieceOrder.length - this.gs.turn);
      if (missedTurns > 0) {
        checkPlayerPenalty(this.gs.gameTurn, this.gs.gameTurn + missedTurns);
        this.gs.turn += missedTurns;
        startTime += (turnDur * missedTurns);
        this.gs.startedAt = new Date(startTime);
      }
    }
  }

  checkPlayerPenalty(startTurn, curTurn) {
    // go through players making sure player made one move for each turn
    // TODO: implement this
  }


  static get _turnDur() {
    return 15 * 1000;
  }

  _allPieces = [
      0o20, 0o30, 0o220, 0o420, 0o120,                        // onesies, twosies
      0o260, 0o230, 0o62, 0o32,                               // corners
      0o70, 0o222, 0o421, 0o124,                              // three in row
      0o360, 0o630, 0o132, 0o231,                             // shifts
      0o262, 0o270, 0o232, 0o72,                              // keys
      0o622, 0o322, 0o226, 0o223, 0o470, 0o74, 0o170, 0o71,   // ells
      0o570, 0o75, 0o626, 0o323,                              // locks
      0o525, 0o272                                            // checkerboard, cross
    ];
};
