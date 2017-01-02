/**
 * Created by randall on 12/27/16.
 */
import {bindable, inject} from 'aurelia-framework';
import $ from 'bootstrap';
import {DOM} from 'aurelia-pal';


@inject(DOM)
export class GamePieceCustomElement {
  @bindable value = 0x111;
  @bindable startLeft = 80;
  @bindable startTop = 300;

  constructor(DOM) {
    this.DOM = DOM;
    this.pieceOptions = {

    };
    this.posLeft = this.startLeft;
    this.posTop = this.startTop;
    this.diffX0 = 0;
    this.diffY0 = 0;
    this.piece = null;
    // this.value = 0;

    this.boxes = [];
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        let el = this.DOM.createElement('img');
        el.src = '/images/cand.png';
        el.style.left = `${col * 32}px`;
        el.style.top = `${row * 32}px`;
        this.boxes.unshift(el);
      }
    }
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
    this.renderBits(this.value);
  }

  valueChanged(newBits, oldBits) {
    console.log(`game piece: ${newBits.toString(16)} (was ${oldBits.toString(16)})`);

    this.renderBits(newBits);
  }

  renderBits(newBits) {
    if (this.piece) {
      console.log(`renderBits: ${newBits.toString(16)}`);
    } else {
      console.log(`renderBits: skipping... ${newBits.toString(16)}`)
    }
    if (this.piece) {
      while (this.piece.firstChild) {
        this.piece.removeChild(this.piece.firstChild);
      }

      let idx = 0;
      let bits = newBits >> 0;
      while ((bits > 0) && (idx < 9)) {
        if (bits & 1) {
          this.piece.appendChild(this.boxes[idx]);
        }
        idx += 1;
        bits = bits >> 1;
      }
    }
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
