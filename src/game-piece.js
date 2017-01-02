/**
 * Created by randall on 12/27/16.
 */
import {bindable, inject} from 'aurelia-framework';
import {DOM} from 'aurelia-pal';
import {GameTray} from 'game-tray';


@inject(DOM)
export class GamePieceCustomElement extends GameTray {
  @bindable value = 0x111;
  @bindable startLeft = 80;
  @bindable startTop = 300;

  constructor(DOM) {
    super(DOM, 3, '/images/cand.png');
    this.DOM = DOM;
    this.pieceOptions = {

    };
    this.posLeft = this.startLeft;
    this.posTop = this.startTop;
    this.diffX0 = 0;
    this.diffY0 = 0;
    this.piece = null;
    // this.value = 0;
  }

  activate(room) {
    this.room = room;
    console.log('room id: ', room.id);
  }

  // attached() {
  //   let qry = $('#game-piece');
  //   let thePiece = qry[0];
  // }

  attached() {
    this.tray = this.piece;
    this.renderBits(this.value);
  }

  valueChanged(newBits, oldBits) {
    console.log(`game piece: ${newBits.toString(16)} (was ${oldBits ? oldBits.toString(16) : 'null'})`);

    this.renderBits(newBits);
  }

  incrementValue() {
    this.value = this.value + 1;
  }

  pieceMoveStart(customEvent) {
    let event = customEvent.detail;
    this.diffY0 = this.piece.offsetTop - event.clientY0;
    this.diffX0 = this.piece.offsetLeft - event.clientX0;
  }

  pieceMove(customEvent) {
    // offsetLeftStart = clientX0 + differenceX
    // offsetLeft = clientX + differenceX
    let event = customEvent.detail;
    // console.log("event", event);
    this.posLeft = event.clientX - event.clientX0;
    this.posTop = event.clientY - event.clientY0;

    //$(this.piece).css({left: this.startLeft + this.posLeft, top: this.startTop + this.posTop});
    this.piece.style.top = `${this.diffY0 + event.clientY}px`;
    this.piece.style.left = `${this.diffX0 + event.clientX}px`;
  }

  pieceRestart(customEvent) {
    let event = customEvent.detail;
    // console.log("event", event);

    //$(this.piece).css({left: this.startLeft, top: this.startTop});
    this.piece.style.top = `${this.startTop}px`;
    this.piece.style.left = `${this.startLeft}px`;
  }
}
