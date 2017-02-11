/**
 * Created by randall on 2/8/17.
 */
import {GameController} from 'game-controller';


class TimeMachine {
  // this is a testing class, but I don't know how to make a class without es2016
  constructor() {
    this.currentTime = (new Date(2017, 0, 1, 0, 0, 0)).getTime()
  }

  getCurrentTime() {
    return new Date(this.currentTime);
  }

  advance(ms) {
    this.currentTime += ms;
  }
};

describe('the GameController', () => {
  it('scores a game wherein the player makes no moves', (done) => {
    let tm = new TimeMachine();
    let sut = new GameController(tm);
    sut.initialize();
    sut.joinRoom("12345", "barack");
    tm.advance(1000);     // this is ignored. game remains in stasis until tickled
    sut.getGameStateForPlayer("12345").then((data) => {
      expect(data.gameState).toBeDefined("missing game state");
      expect(data.gameState.gameTurn).toBe(-1, "wrong turn number for game start");
      expect(data.gameState.turnTimer).toBe(120000, "wrong number of ms remaining to game start");
      tm.advance(9000);
      return (sut.getGameStateForPlayer("12345"));
    }).then((data) => {
      expect(data.gameState.gameTurn).toBe(-1, "wrong turn number for 6 seconds before start");
      expect(data.gameState.turnTimer).toBe(111000, "wrong number of ms remaining to game start");
      tm.advance(114000);
      return (sut.getGameStateForPlayer("12345"));
    }).then((data) => {
      expect(data.gameState.gameTurn).toBe(0, "wrong turn number for first turn");
      expect(data.gameState.turnTimer).toBe(12000, "wrong number of ms remaining in first turn");
      expect(data.playerState).toBeDefined("missing player state");
      expect(data.playerState.boardVal).toBe(0, "wrong board configuration");
      tm.advance(12000);
      return (sut.getGameStateForPlayer("12345"));
    }).then((data) => {
      expect(data.gameState.gameTurn).toBe(1, "wrong turn number for first turn");
      expect(data.gameState.turnTimer).toBe(15000, "wrong number of ms remaining in first turn");
      expect(data.playerState.playerPts).toBe(-7, "wrong number of penalty points for expired turn timer");
      tm.advance(61000);
      return (sut.getGameStateForPlayer("12345"));
    }).then((data) => {
      expect(data.gameState.gameTurn).toBe(-1, "wrong turn number for game end");
      expect(data.gameState.turnTimer).toBe(120000, "wrong number of ms remaining in intermission");
      expect(data.playerState.playerPts).toBe(-28, "wrong score for end of game");
      done();
    });
  });
  it('scores a game wherein the player attains the highest score', (done) => {
    let tm = new TimeMachine();
    let sut = new GameController(tm);
    sut.initialize();
    sut.joinRoom("23456", "abe");
    sut.getGameStateForPlayer("12345").then((data) => {
      expect(data.gameState).toBeDefined("missing game state");
      expect(data.gameState.gameTurn).toBe(-1, "wrong turn number for game start");
      tm.advance(1000);
      sut.skipToNextTurn();
      return sut.getGameStateForPlayer("23456");
    }).then((data) => {
      expect(data.gameState.gameTurn).toBe(0, "wrong turn number for first turn");
      expect(data.gameState.turnTimer).toBe(15000, "wrong number of ms remaining in first turn");
      expect(data.playerState.playerPts).toBe(0, "wrong number of points before end of first turn");
      tm.advance(1000);
      return sut.recordPlayerMove("23456", 0, 0, 1);
    }).then((data) => {
      expect(data.gameState.gameTurn).toBe(0, "wrong turn number for first turn");
      expect(data.playerState.boardVal).toBe(0b00010001100001000000);
      tm.advance(1000);
      sut.skipToNextTurn();
      return sut.getGameStateForPlayer("23456");
    }).then((data) => {
      expect(data.gameState.gameTurn).toBe(1, "wrong turn number for second turn");
      expect(data.gameState.turnTimer).toBe(15000, "wrong number of ms remaining in first turn");
      tm.advance(1000);
      return sut.recordPlayerMove("23456", 1, 2, 1);
    }).then((data) => {
      expect(data.gameState.gameTurn).toBe(1, "wrong turn number for second turn");
      expect(data.playerState.boardVal).toBe(0b01110011100111000000);
      tm.advance(1000);
      sut.skipToNextTurn();
      return sut.getGameStateForPlayer("23456");
    }).then((data) => {
      expect(data.gameState.gameTurn).toBe(2, "wrong turn number for third turn");
      expect(data.gameState.turnTimer).toBe(15000, "wrong number of ms remaining in first turn");
      expect(data.playerState.playerPts).toBe(45, "wrong score for 3x3 block");
      expect(data.playerState.boardVal).toBe(0, "board should be clear after scoring 9x9 block");
      tm.advance(1000);
      return sut.recordPlayerMove("23456", 2, 1, 0);
    }).then((data) => {
      expect(data.gameState.gameTurn).toBe(2, "wrong turn number for third turn");
      expect(data.playerState.boardVal).toBe(0b001000110000000);
      tm.advance(1000);
      sut.skipToNextTurn();
      return sut.getGameStateForPlayer("23456");
    }).then((data) => {
      expect(data.gameState.gameTurn).toBe(3, "wrong turn number for fourth turn");
      expect(data.gameState.turnTimer).toBe(15000, "wrong number of ms remaining in first turn");
      tm.advance(1000);
      return sut.recordPlayerMove("23456", 3, 2, 2);
    }).then((data) => {
      expect(data.gameState.gameTurn).toBe(3, "wrong turn number for fourth-1 turn");
      expect(data.playerState.boardVal).toBe(0b01100011000110000000);
      tm.advance(1000);
      sut.skipToNextTurn();
      return sut.getGameStateForPlayer("23456");
    }).then((data) => {
      expect(data.gameState.gameTurn).toBe(-1, "wrong turn number for intermission");
      expect(data.gameState.turnTimer).toBe(120000, "wrong number of ms remaining in first turn");
      expect(data.playerState.playerPts).toBe(63, "wrong score for 3x2 block");
      expect(data.playerState.boardVal).toBe(0, "board should be clear after scoring 3x2 block");
      done();
    })
  })
});

/*

 Returns: gameState: {roomId, gameId, gameTurn, turnTimer, pieceVal, piecePreview: [pieceVal0, pieceVal1, ...]}
 playerState: {playerId, playerPts, boardVal}
 */
