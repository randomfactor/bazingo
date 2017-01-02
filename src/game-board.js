/**
 * Created by randall on 1/2/17.
 */
import {bindable, inject} from 'aurelia-framework';
import {DOM} from 'aurelia-pal';
import {GameTray} from 'game-tray';

// function toBoardIndex(x) {
//   return Math.floor((x + 15) / 32);
// }

var toBoardIndex = (x) => Math.floor((x + 15) / 32);

@inject(DOM)
export class GameBoardCustomElement extends GameTray {
  @bindable value = 0x104141;
  @bindable pieceValue;

  constructor(DOM) {
    super(DOM, 5, '/images/occ.png');
    this.DOM = DOM;
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
    console.log(`relX: ${piece.offsetLeft - target.offsetLeft}  relY: ${piece.offsetTop - target.offsetTop}  piece: ${this.pieceValue.toString(16)}`);
    console.log(`indX: ${toBoardIndex(piece.offsetLeft - target.offsetLeft)}  indY: ${toBoardIndex(piece.offsetTop - target.offsetTop)}`)
  }
}
