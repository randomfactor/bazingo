/**
 * Created by randall on 12/26/16.
 */

import {bindable, inject, computedFrom} from 'aurelia-framework';
import {DOM} from 'aurelia-pal';
import {EventAggregator} from 'aurelia-event-aggregator';
import * as GameMsg from 'messages';

@inject(DOM, EventAggregator)
export class GamePlay {
  constructor(dom, ea, board, piece) {
    this.pieceVal = 0x155;
    this.boardVal = 0x1fac400;

    this.dom = dom;
    this.ea = ea;
    ea.subscribe(GameMsg.GameLogMessage, msg => {
      this.logMessage(msg.toString());
    });
    // this.board is a reference to the view model of the game board
    // this.piece is a reference to the view model of the game piece

    this.gameInfo = {score: "0 pts.", timer: 0, turn: "Starting...", preview: [0o626, 0x155]}
    this.runningTimer = null;
  }

  @computedFrom("gameInfo.timer")
  get timerMinutes() {
    if (this.gameInfo.timer <= 0) {
      return ('-');
    }
    let m = Math.floor(this.gameInfo.timer / (60 * 1000));
    return m.toString();
  }

  @computedFrom("gameInfo.timer")
  get timerSeconds() {
    if (this.gameInfo.timer <= 0) {
      return ('--');
    }
    let m = Math.floor(this.gameInfo.timer / (60 * 1000));
    let s = Math.floor((this.gameInfo.timer - m * 60 * 1000) / 1000);
    s = s + '';
    return s.length >= 2 ? s : '0' + s;
  }

  runTimer(val) {
    if (val) {
      if (!this.runningTimer) {
        this.runningTimer = setInterval(() => {
          this.gameInfo.timer = this.gameInfo.timer - 1000;
          if (this.gameInfo.timer <= 0) {
            this.gameInfo.timer = 0;
            this.runTimer(false);
          }
        }, 1000);
      }
    } else {
      if (this.runningTimer) {
        clearInterval(this.runningTimer);
        this.runningTimer = null;
      }
    }
  }

  logMessage(msg) {
    let tn = this.dom.createTextNode(msg);
    this.gameArea.appendChild(tn);
    let br = this.dom.createElement('br');
    this.gameArea.appendChild(br);
  }

  testGameState(evt) {
    switch (this.gameState) {
      default:
        this.board.gameOver();
        this.pieceVal = 0;
        this.boardVal = 0;
        this.gameInfo.score = "0 pts.";
        this.gameInfo.timer = 119333;
        this.gameInfo.turn = "Starting...";
        this.gameInfo.preview = [0o20, 0o420, 0o124];
        this.runTimer(true);
        this.gameState = 1;
        break;

      case 1:
        this.piece.pieceRestart();
        this.board.gameStart();
        this.pieceVal = this._pieces[5];
        this.boardVal = 0x1fac400;
        this.gameInfo.score = "345 pts.";
        this.gameInfo.timer = 7000;
        this.gameInfo.turn = "Turn 29";
        this.gameState = 2;
        this.runTimer(true);
        this.gameInfo.preview = [0o272, 0o20, 0o420];
        break;
    }
  }

  _pieces = [
    0o20, 0o30, 0o220, 0o420, 0o120,                        // onesies, twosies
    0o260, 0o230, 0o62, 0o32,                               // corners
    0o70, 0o222, 0o421, 0o124,                              // three in row
    0o360, 0o630, 0o132, 0o231,                             // shifts
    0o262, 0o270, 0o232, 0o72,                              // keys
    0o622, 0o322, 0o226, 0o223, 0o470, 0o74, 0o170, 0o71,   // ells
    0o570, 0o75, 0o626, 0o323,                              // locks
    0o525, 0o272                                            // checkerboard, cross
  ]
}
