"use strict";

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
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getGameStateAndEmit(socket), 100);
  socket.on("Click", function(data) {
    console.log("Click by " + data.name + data.id);
    GameInstance.getInstance().addClick(data.id);
  });

  socket.on("leave", function(data) {
    console.log("Click by " + data.name);
    GameInstance.getInstance().removePlayer(data.id);
  });

  socket.on("join", function(data) {
    console.log("New Player joined with name : " + data.name);
  //  if (!GameInstance.getInstance().isPlayerAlreadyJoined(data.id)) {
      GameInstance.getInstance().addPlayer({
        name: data.name,
        id: data.id,
        score: 20,
        socketid: socket.id,
      });
    
  
  });

  socket.on("disconnect", () => {
    console.log(
      "Player Disconnected"
    );
    if (GameInstance.getInstance().isPlayerAlreadyJoined(socket.id)) 
      setTimeout(removePlayer, 5000, socket.id);
    //GameInstance.getInstance().removePlayer(socket.id);
  });
});

const removePlayer = socketid => {
  
    var removable = GameInstance.getInstance().getPlayerBySocketId(socketid);
    console.log(removable);
    if (removable != undefined) {
      console.log(
        removable.name +
          " is being removed from game due to not reconnecting in allocated time."
      );
      GameInstance.getInstance().removePlayer(removable.id);
      console.log(GameInstance.getInstance().count());
    }
  
};

const getGameStateAndEmit = async socket => {
  try {
    socket.emit("GameInstance", GameInstance.getInstance()); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

const getPlayerBySocketId = socket => {
  for (let i = 0; i < GameInstance.players; i++) {
    if (GameInstance.players[i].id == socket.id) return GameInstance.players[i];
  }
  return null;
};
