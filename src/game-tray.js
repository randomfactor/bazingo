/**
 * Created by randall on 1/2/17.
 */
import {DOM} from 'aurelia-pal';

export class GameTray {

  constructor(DOM, side, tilePath) {
    this.DOM = DOM;
    this.side = side;
    this.tilePath = tilePath;
    this.tray = null;
    this.value = null;

    this.id = this.side.toString() + 'x' + this.side.toString();

    this.boxes = [];
    for (let row = 0; row < this.side; row += 1) {
      for (let col = 0; col < this.side; col += 1) {
        let el = this.DOM.createElement('img');
        el.src = this.tilePath;
        el.style.left = `${col * 32}px`;
        el.style.top = `${row * 32}px`;
        this.boxes.unshift(el);
      }
    }
  }

  renderBits(newBits) {
    if (this.tray) {
      console.log(`renderBits[${this.id}]: ${newBits.toString(16)}`);
    } else {
      console.log(`renderBits[${this.id}]: skipping... ${newBits.toString(16)}`)
    }
    if (this.tray) {
      while (this.tray.firstChild) {
        this.tray.removeChild(this.tray.firstChild);
      }

      let idx = 0;
      let bits = newBits >> 0;
      while ((bits > 0) && (idx < (this.side * this.side))) {
        if (bits & 1) {
          this.tray.appendChild(this.boxes[idx]);
        }
        idx += 1;
        bits = bits >> 1;
      }
    }
  }
}
