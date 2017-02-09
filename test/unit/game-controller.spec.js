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
  it('returns 6s left in turn after 9s passes', (done) => {
    let tm = new TimeMachine();
    let sut = new GameController(tm);
    sut.initialize();
    sut.join("12345", "barack");
    tm.advance(1000);     // this is ignored. game remains in stasis until tickled
    sut.getGameStateForPlayer("12345").then((data) => {
      expect(data.gameState).toBeDefined("missing game state");
      expect(data.gameState.turnTimer).toBe(15000, "wrong number of ms remaining");
      tm.advance(9000);
      return (sut.getGameStateForPlayer("12345"));
    }).then((data) => {
      expect(data.gameState).toBeDefined("missing game state");
      expect(data.gameState.turnTimer).toBe(6000, "wrong number of ms remaining");

      done();
    });
  });
});

/*

 Returns: gameState: {roomId, gameId, gameTurn, turnTimer, pieceVal, piecePreview: [pieceVal0, pieceVal1, ...]}
 playerState: {playerId, playerPts, boardVal}
 */
