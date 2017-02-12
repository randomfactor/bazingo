/**
 * Created by randall on 2/8/17.
 */

import {inject} from 'aurelia-framework';
import {GameBits} from 'game-bits';
import {PieceShuffler} from 'piece-shuffler';

export class GameClockFactory {
  getCurrentTime() {
    return new Date();
  }
}

@inject(GameClockFactory, PieceShuffler)
export class GameController {
  constructor(gcf, shuffler) {
    this.players = new Map();
    this.gcf = gcf;
    this.shuffler = shuffler;
    this.initialize();
  }

  initialize() {
    this.gs = {id: "practice", turn: -1, timeout: GameController._intermissionDur, startedAt: null};
    this.pieceOrder = [0];
  }

  startNewGame() {
    for (let [k, val] of this.players) {
      val.board.set(0);
      val.points = 0;
      val.moves = [];
    }
    this.pieceOrder = this.shuffler.getRandomPieces(20);
  }

  joinRoom(playerId, nickName) {
    this.players.set(playerId, {name: nickName, board: new GameBits(0), points: 0, moves: []});
  }

  getGameStateForPlayer(playerId) {
    let p = new Promise((resolve, reject) => {
      let now = this.gcf.getCurrentTime();
      this.checkNextTurn(now);

      // compute game state
      let currentPiece = this.gs.turn >= 0 && this.gs.turn < this.pieceOrder.length ? this.pieceOrder[this.gs.turn] : 0;
      let preview = this.pieceOrder.slice(this.gs.turn + 1, this.gs.turn + 4);
      let gs = {roomId: "SinglePlayer", gameId: this.gs.id, gameTurn: this.gs.turn,
        turnTimer: (this.gs.timeout - (now.getTime() - this.gs.startedAt.getTime())),
        pieceVal: currentPiece, piecePreview: preview};

      // compute player state
      let player = this.players.get(playerId);
      let ps = {};
      if (player) {
        ps = {playerId: playerId, playerPts: player.points, boardVal: player.board.bits};
      }

      resolve({gameState: gs, playerState: ps});
    });
    return p;
  }


  recordPlayerMove(playerId, turn, offsetX, offsetY) {
    let player = this.players.get(playerId);
    if (player && this.gs.turn >= 0 && this.gs.turn < this.pieceOrder.length
      && turn == this.gs.turn && typeof player.moves[this.gs.turn] == 'undefined') {
      if (typeof offsetX == 'number' && typeof offsetY == 'number') {
        let beforeBits = player.board.bits;
        let pieceVal = this.pieceOrder[this.gs.turn];
        if (player.board.combine(pieceVal, offsetX, offsetY) != beforeBits) {
          player.moves[this.gs.turn] = {piece: pieceVal, offX: offsetX, offY: offsetY};
          console.log(`player ${playerId} moved: ${JSON.stringify(player.moves[this.gs.turn])}`);
        }
      }
    }
    return this.getGameStateForPlayer(playerId);
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
        if (this.gs.turn < 0) {
          this.startNewGame();      // timer elapsed at end of intermission
        }
        this.checkPlayerPenalty(this.gs.turn, this.gs.turn + missedTurns);
        this.gs.turn += missedTurns;
        if (this.gs.turn < this.pieceOrder.length) {
          startTime += (turnDur * missedTurns);
          this.gs.startedAt = new Date(startTime);
          this.gs.timeout = GameController._turnDur;
        } else {
          this.gs.turn = -1;
          this.gs.startedAt = new Date(curTime);
          this.gs.timeout = GameController._intermissionDur;
        }
      }
    }
  }

  skipToNextTurn() {
    if (this.gs.turn < 0) {
      this.startNewGame();    // player skipped in intermission
    }
    if (this.gs.turn < this.pieceOrder.length) {
      this.updatePlayerScores(this.gs.turn);
      this.gs.turn += 1;
      this.gs.startedAt = this.gcf.getCurrentTime();
      if (this.gs.turn < this.pieceOrder.length) {
        this.gs.timeout = GameController._turnDur;
      } else {
        this.gs.timeout = GameController._intermissionDur;
        this.gs.turn = -1;
      }
    }
  }

  updatePlayerScores(turnNo) {
    for (let [k, val] of this.players) {
      if (turnNo < 0) {
        val.points = 0;     // initializing game
      } else if (typeof val.moves[turnNo] == 'undefined') {
        val.points += GameController._penaltyPts;
      } else {
        // players board may contain scoring blocks
        val.points += val.board.scoreBlocks(0);
      }
    }
  }

  checkPlayerPenalty(startTurn, curTurn) {
    // go through players making sure player made one move for each turn
    curTurn = Math.min(curTurn, this.pieceOrder.length);
    startTurn = Math.max(startTurn, 0);
    console.log(`checking player penalties from ${startTurn} to ${curTurn}`);
    for (let turnNo = startTurn; turnNo < curTurn; turnNo++) {
      this.updatePlayerScores(turnNo);
    }
  }

  static get _penaltyPts() { return -7; }
  static get _points4() { return 4; }   // 4 bits at 1 pt per bit
  static get _points6() { return 18; }  // 6 bits at 3 pts per bit
  static get _points9() { return 45; }  // 9 bits at 5 pts per bit

  static get _turnDur() { return 15 * 1000; }
  static get _intermissionDur() { return 120 * 1000; }
};
