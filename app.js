const GameInstance = require("./Game/GameInstance");
const express = require("express");
const socketIO = require("socket.io");

const PORT = process.env.PORT || 4000;

const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);

const io = socketIO(server);

let interval;
io.on("connection", socket => {
  
  interval = setInterval(() => getGameStateAndEmit(socket), 100);
  socket.on("Click", function(data) {
    console.log("Click by " + data.name + data.id);
    GameInstance.getInstance().addClick(data.id);
  });

  socket.on("leave", function(data) {
    console.log(data.name+" is leaving the game");
    GameInstance.getInstance().removePlayer(socket.id);
  });

  socket.on("ResetPlayer", function(data) {
    console.log("Reset player "+data.name);
    GameInstance.getInstance().resetPlayer(data.id);
  });

  socket.on("join", function(data) {
    console.log("New Player joined with name : " + data.name);
  //  if (!GameInstance.getInstance().isPlayerAlreadyJoined(data.id)) {
    if(GameInstance.getInstance().isPlayerAlreadyJoined(data.id)){
      console.log(data.name + " reconnected before getting removed");
      GameInstance.getInstance().setPlayerRemovableById(data.id, false);
    }else{
      GameInstance.getInstance().addPlayer({
        name: data.name,
        id: data.id,
        score: 20,
        socketid: socket.id,
        shouldKick: false
      });
    }
    
  
  });

  socket.on("disconnect", () => {
    console.log(
      "Player Disconnected"
    );
    if (interval) {
      clearInterval(interval);
    }
   
    if (GameInstance.getInstance().isPlayerAlreadyJoinedBySocketId(socket.id)) {
      var removable = GameInstance.getInstance().getPlayerBySocketId(socket.id);
      GameInstance.getInstance().setPlayerRemovableBySocketId(socket.id, true);
      setTimeout(removePlayer, 10000, removable);
    }
    //GameInstance.getInstance().removePlayer(socket.id); 
  });
});

const removePlayer = removable => {
  if(removable.shouldKick){
    console.log(removable);
    if (removable != undefined) {
      console.log(
        removable.name +
          " is being removed from game due to not reconnecting in allocated time."
      );
      GameInstance.getInstance().removePlayer(removable.socketid);
      console.log(GameInstance.getInstance().count());
    }
  }return;
};

const getGameStateAndEmit = async socket => {
  try {
    socket.emit("GameInstance", GameInstance.getInstance()); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

