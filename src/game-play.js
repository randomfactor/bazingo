/**
 * Created by randall on 12/26/16.
 */


import $ from 'bootstrap';

export class GamePlay {



  constructor() {
    this.pieceOptions = {

    };
    this.xPositionPiece = 0;
    this.yPositionPiece = 0;
    this.xStartPiece = 80;
    this.yStartPiece = 300;
  }

  activate(room) {
    this.room = room;
    console.log('room id: ', room.id);
  }

  attached() {
    var qry = $('#game-piece');
    this.piece = qry[0];
  }

  pieceMove(customEvent) {
    var event = customEvent.detail;
    //console.log("event", event);
    this.xPositionPiece = event.clientX - event.clientX0;
    this.yPositionPiece = event.clientY - event.clientY0;

    $(this.piece).css({left: this.xStartPiece + this.xPositionPiece, top: this.yStartPiece + this.yPositionPiece});
  }

  pieceRestart(customEvent) {
    var event = customEvent.detail;
    console.log("event", event);

    $(this.piece).css({left: this.xStartPiece, top: this.yStartPiece});
  }
}

