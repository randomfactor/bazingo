/**
 * Created by randall on 1/2/17.
 */
import {bindable, inject} from 'aurelia-framework';
import {DOM} from 'aurelia-pal';
import {GameTray} from 'game-tray';
import {EventAggregator} from 'aurelia-event-aggregator';
import * as GameMsg from 'messages';

// function toBoardIndex(x) {
//   return Math.floor((x + 15) / 32);
// }

var toBoardIndex = (x) => Math.floor((x + 15) / 32);

@inject(DOM, EventAggregator)
export class GameBoardCustomElement extends GameTray {
  @bindable value = 0x104141;
  @bindable pieceValue;

  constructor(dom, ea) {
    super(dom, 5, '/images/occ.png');
    this.ea = ea;
    this.board = null;
  }

  attached() {
    this.tray = this.board;
    this.renderBits(this.value);
  }

  valueChanged(newBits, oldBits) {
    console.log(`game board: ${newBits.toString(16)} (was ${oldBits ? oldBits.toString(16) : 'null'})`);

    this.renderBits(newBits);
  }

  pieceDrop(evt) {
    let target = evt.detail.target;
    let piece = evt.detail.dragEvent.target;
    let indX = toBoardIndex(piece.offsetLeft - target.offsetLeft);
    let indY = toBoardIndex(piece.offsetTop - target.offsetTop);
    console.log(`relX: ${piece.offsetLeft - target.offsetLeft}  relY: ${piece.offsetTop - target.offsetTop}  piece: ${this.pieceValue.toString(16)}`);
    console.log(`indX: ${toBoardIndex(piece.offsetLeft - target.offsetLeft)}  indY: ${toBoardIndex(piece.offsetTop - target.offsetTop)}`);

    if (indX >= -1 && indX <= 3 && indY >= -1 && indY <= 3) {
      let msg = new GameMsg.GamePieceSnap(indX, indY, target.offsetLeft + 32 * indX, target.offsetTop + 32 * indY);
      this.ea.publish(msg);
    } else {
      let msg = new GameMsg.GameDropReject(piece.offsetLeft, piece.offsetTop);
      this.ea.publish(msg);
    }
  }
}
