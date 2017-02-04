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
        this.gameState = 1;
        break;

      case 1:
        this.piece.pieceRestart();
        this.board.gameStart();
        this.pieceVal = 0x155;
        this.gameState = 2;
        break;
    }
  }
}
