/**
 * Created by randall on 12/26/16.
 */

import {bindable, inject} from 'aurelia-framework';
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

    this.gameInfo = {score: "0 pts.", timer: "-:--", turn: "Starting...", preview: [0o626, 0x155]}
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
        this.gameInfo.timer = "-:--";
        this.gameInfo.turn = "Starting...";
        this.gameInfo.preview = [0o20, 0o420, 0o124];
        this.gameState = 1;
        break;

      case 1:
        this.piece.pieceRestart();
        this.board.gameStart();
        this.pieceVal = 0o30;
        this.boardVal = 0x1fac400;
        this.gameInfo.score = "345 pts.";
        this.gameInfo.timer = "0:07";
        this.gameInfo.turn = "Turn 29";
        this.gameState = 2;
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
