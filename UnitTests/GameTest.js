var assert = require("assert");
const GameInstance = require("../Game/GameInstance");

describe("GameInstance", function() {
    describe("#removePlayer() && #isPlayerAlreadyJoined", function() {
        it("should remove player and make sure it exists", function(done) {
          var player1 = {
            name: "john",
            id: "id12",
            score: 20,
            socketid: "socketid12"
          };
          GameInstance.getInstance().addPlayer(player1);
          assert.equal(GameInstance.getInstance().getPlayerBySocketId(player1.socketid).name, "john");
          assert.equal(GameInstance.getInstance().count(), 1);

          GameInstance.getInstance().removePlayer(player1.id);
          assert.equal(GameInstance.getInstance().count(), 0);
          
          done();
        });
      });


  describe("#getPlayerBySocketId()", function() {
    it("should get without errors", function(done) {
      var player1 = {
        name: "john",
        id: "id12",
        score: 20,
        socketid: "socketid12"
      };
      GameInstance.getInstance().addPlayer(player1);
      var result = GameInstance.getInstance().getPlayerBySocketId("socketid12");
      assert.equal(result.socketid, "socketid12");

      done();
    });
  });
});
