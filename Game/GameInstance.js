const uuidv1 = require("uuid/v1");

let instance = null;

const GameSettings = {
  max_players: 4
};

/** Singleton pattern to maintain one game at all times */
class GameInstance {
  constructor() {
    this.Players = {};
    this.clicks = 0;
  }

  getPlayers() {
    return this.Players;
  }

  isPlayerAlreadyJoined(id){
    return (this.Players[id] == undefined);
  }

  count(){
    return Object.keys(this.Players).length;
  }

  addPlayer(player) {
    this.Players[player.id] = {
      name:player.name, 
      score: 20,
      socketid: player.socketid
    };
  }

  getPlayerBySocketId(socketid){
    for (var key in this.Players) {
      if(this.Players[key].socketid = socketid) 
        return this.Players[key];
    }
  }

  setPlayerRemovable(socketid, value){
    this.getPlayerBySocketId(socketid).shouldRemove = value;
  }
  
  getPlayer(id) {return this.Players[id];}

  removePlayer(id) {
    var newDict = {};
    for (var key in this.Players) {
      if(key != id){
        newDict[id] = this.Players[id];
      }
    }
    this.Players = newDict();
    
    /*
    console.log("Has player to remove "+this.Players.hasOwnProperty(id))
    if(this.Players.hasOwnProperty(id)){
         delete this.Players[id];
    }return;
    */
  }

  /**Add's a click and checks if player should be given points */
  addClick(id){
      this.clicks += 1;
      this.Players[id].score -= 1;
      console.log(id);
      if(this.clicks % 500 == 0){

        this.Players[id].score += 250;

        console.log("Player "+  
        this.Players[id].name + "Was awarded 250 points");
        
      }
      if(this.clicks % 100 == 0 && this.clicks % 500 != 0){
        this.Players[id].score += 40;
        console.log("Player "+  
        this.Players[id].name + "Was awarded 250 points");
      }
      if (this.clicks % 10 == 0 && this.clicks % 100 != 0){
        this.Players[id].score += 5; 
        console.log("Player "+  
        this.Players[id].name + "Was awarded 250 points");
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
