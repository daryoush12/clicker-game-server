const uuidv1 = require("uuid/v1");

let instance = null;

const GameSettings = {
  max_players: 4
};

/** Singleton pattern to maintain one game at all times */
class GameInstance {
  constructor() {
    this.Players = [];
    this.clicks = 0;
  }

  getPlayers() {
    return this.Players;
  }

  addPlayer(player) {
    if (this.Players.length + 1 <= GameSettings.max_players)
      this.Players.push(player);
    else throw "Maximum amount of players already reached..";
  }

  getPlayer(id) {
    for (let i = 0; i < this.Players.length; i++) {
      console.log("Comparing : "+ id +" To "+this.Players[i].name);
      if (this.Players[i].id == id) return this.Players[i];
    }
    return null;
  }

  removePlayer(id) {
    for (let i = 0; i < this.Players.length; i++) {
      if (this.Players[i].id == id) {
            console.log("splicing : "+this.Players[i].id)
            this.Players.splice(i, 1);
      }
    }
  }

  /**Add's a click and checks if player should be given points */
  addClick(id){
      this.clicks += 1;
      this.getPlayer(id).score -= 1;
      console.log(id);
      if (this.clicks % 10 == 0 && this.clicks % 100 != 0){
         this.getPlayer(id).score += 10; 
      }
      if(this.clicks % 10 == 0 && this.clicks % 100 == 0){
        this.getPlayer(id).score += 20;
      }
  }

 


  static getInstance() {
    if (!instance) {
      instance = new GameInstance();
    }
    return instance;
  }
}

module.exports = GameInstance;
