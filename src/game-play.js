/**
 * Created by randall on 12/26/16.
 */

import {bindable, inject} from 'aurelia-framework';
import {DOM} from 'aurelia-pal';
import {EventAggregator} from 'aurelia-event-aggregator';
import * as GameMsg from 'messages';

@inject(DOM, EventAggregator)
export class GamePlay {
  constructor(dom, ea) {
    this.pieceVal = 0x155;
    this.boardVal = 0x1fac400;

    this.dom = dom;
    this.ea = ea;
    ea.subscribe(GameMsg.GameLogMessage, msg => {
      this.logMessage(msg.toString());
    });
  }

  logMessage(msg) {
    let tn = this.dom.createTextNode(msg);
    this.gameArea.appendChild(tn);
    let br = this.dom.createElement('br');
    this.gameArea.appendChild(br);
  }
}
