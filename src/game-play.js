/**
 * Created by randall on 12/26/16.
 */

import {bindable, inject, computedFrom} from 'aurelia-framework';
import {DOM} from 'aurelia-pal';
import {EventAggregator} from 'aurelia-event-aggregator';
import {GameController} from 'game-controller';
import * as GameMsg from 'messages';

@inject(DOM, EventAggregator, GameController)
export class GamePlay {
  constructor(dom, ea, gamectl) {
    this.pieceVal = 0;
    this.boardVal = 0;

    this.dom = dom;
    this.ea = ea;
    this.gamectl = gamectl;
    ea.subscribe(GameMsg.GameLogMessage, msg => {
      this.logMessage(msg.toString());
    });
    ea.subscribe(GameMsg.GameMove, msg => {
      console.log('received game move ' + JSON.stringify(msg));
      this.playerMove(msg);
    });
    // this.board is a reference to the view model of the game board
    // this.piece is a reference to the view model of the game piece

    this.gameInfo = {score: "0 pts.", timer: 0, turn: "Starting...", preview: [0o626, 0x155]}
    this.playerId = "54321";
    this.runningTimer = null;
  }

  attached() {
    // first time initialization
    this.gamectl.initialize();
    this.gamectl.joinRoom(this.playerId, "Practice Pete");
    this.updateGameState();
  }

  canDeactivate() {
    this.runTimer(false);
    return true;
  }

  @computedFrom("gameInfo.timer")
  get timerMinutes() {
    if (this.gameInfo.timer <= 0) {
      return ('-');
    }
    let m = Math.floor(this.gameInfo.timer / (60 * 1000));
    return m.toString();
  }

  @computedFrom("gameInfo.timer")
  get timerSeconds() {
    if (this.gameInfo.timer <= 0) {
      return ('--');
    }
    let m = Math.floor(this.gameInfo.timer / (60 * 1000));
    let s = Math.floor((this.gameInfo.timer - m * 60 * 1000) / 1000);
    s = s + '';
    return s.length >= 2 ? s : '0' + s;
  }

  @computedFrom("gameInfo.turn")
  get turnMsg() {
    if (this.gameInfo.turn >= 0) {
      return `Turn ${this.gameInfo.turn + 1}`;
    } else {
      return 'Starting...';
    }
  }

  runTimer(val) {
    if (val) {
      if (!this.runningTimer) {
        this.runningTimer = setInterval(() => {
          this.gameInfo.timer = this.gameInfo.timer - 1000;
          if (this.gameInfo.timer <= 0) {
            this.gameInfo.timer = 0;
            this.runTimer(false);
            this.updateGameState()
          }
        }, 1000);
      }
    } else {
      if (this.runningTimer) {
        clearInterval(this.runningTimer);
        this.runningTimer = null;
      }
    }
  }

  updateGameState() {
    this.gamectl.getGameStateForPlayer(this.playerId).then(
      (data) => {
        this.pieceVal = data.gameState.pieceVal;
        this.boardVal = (data.playerState && typeof data.playerState.boardVal == 'number') ? data.playerState.boardVal : 0;
        console.log('player state: ' + JSON.stringify(data.playerState));
        this.gameInfo.score = `${data.playerState.playerPts} pts.`;
        this.gameInfo.timer = data.gameState.turnTimer;
        if (this.gameInfo.timer > 0) {
          this.runTimer(true);
        }
        this.gameInfo.turn = data.gameState.gameTurn;
        this.gameInfo.preview = data.gameState.piecePreview;
      },
      (err) => {
        this.logMessage('Game Controller error: ' + JSON.stringify(err));
      })
  }

  /*
   data: {gameState: {roomId, gameId, gameTurn, turnTimer, pieceVal, piecePreview},
   playerState: {playerId, playerPts, boardVal}}
   */

  logMessage(msg) {
    let tn = this.dom.createTextNode(msg);
    this.gameArea.appendChild(tn);
    let br = this.dom.createElement('br');
    this.gameArea.appendChild(br);
  }

  skipTurn() {
    this.runTimer(false);
    this.gamectl.skipToNextTurn();
    this.updateGameState();
  }

  playerMove(msg) {
    this.gamectl.recordPlayerMove(this.playerId, this.gameInfo.turn, msg.X, msg.Y)
      .then(
        (data) => {
          console.log('player moved: ' + JSON.stringify(data.playerState));
          this.skipTurn();
        },
        (err) => {
          this.logMessage('Game Controller error: ' + JSON.stringify(err));
      });
  }

  testGameState(evt) {
    switch (this.gameState) {
      default:
        this.board.gameOver();
        this.pieceVal = 0;
        this.boardVal = 0;
        this.gameInfo.score = "0 pts.";
        this.gameInfo.timer = 119333;
        this.gameInfo.turn = "Starting...";
        this.gameInfo.preview = [0o20, 0o420, 0o124];
        this.runTimer(true);
        this.gameState = 1;
        break;

      case 1:
        this.piece.pieceRestart();
        this.board.gameStart();
        this.pieceVal = this._pieces[5];
        this.boardVal = 0x1fac400;
        this.gameInfo.score = "345 pts.";
        this.gameInfo.timer = 7000;
        this.gameInfo.turn = "Turn 29";
        this.gameState = 2;
        this.runTimer(true);
        this.gameInfo.preview = [0o272, 0o20, 0o420];
        break;
    }
  }
}
