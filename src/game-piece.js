/**
 * Created by randall on 12/27/16.
 */
import {bindable, inject} from 'aurelia-framework';
import {DOM} from 'aurelia-pal';
import {GameTray} from 'game-tray';
import {EventAggregator} from 'aurelia-event-aggregator';
import * as GameMsg from 'messages';


@inject(DOM, EventAggregator)
export class GamePieceCustomElement extends GameTray {
  @bindable value = 0x111;
  @bindable startLeft = 80;
  @bindable startTop = 300;

  constructor(dom, ea) {
    super(dom, 3, '/images/cand.png');
    this.ea = ea;
    this.pieceOptions = {

    };
    this.posLeft = this.startLeft;
    this.posTop = this.startTop;
    this.diffX0 = 0;
    this.diffY0 = 0;
    this.piece = null;
    this.isDropped = false;
    // this.value = 0;

    ea.subscribe(GameMsg.GamePieceSnap, msg => {
      console.log(`Piece snap: ${msg}`);
      this.pieceSnap(msg.posX, msg.posY);
    });
    ea.subscribe(GameMsg.GameDropReject, msg => {
      console.log(`Piece reject: ${msg}`);
      this.pieceRestart();
    })
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

  pieceMoveStart(customEvent) {
    let event = customEvent.detail;
    this.diffY0 = this.piece.offsetTop - event.clientY0;
    this.diffX0 = this.piece.offsetLeft - event.clientX0;
    this.isDropped  = false;
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

  pieceSnap(posX, posY) {
    this.piece.style.top = `${posY}px`;
    this.piece.style.left = `${posX}px`;
    this.isDropped  = true;
  }

  pieceRestart() {
    this.piece.style.top = `${this.startTop}px`;
    this.piece.style.left = `${this.startLeft}px`;
    this.isDropped = false;
  }

  // TODO: need to find a way to disable dragging piece after locked
  lockPiece(customEvent) {
    let event = customEvent.detail;
    if (this.isDropped) {
      debugger;
      console.log(this.piece.options);
    }
  }
}
