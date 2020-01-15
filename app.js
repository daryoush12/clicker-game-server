const GameInstance = require("./Game/GameInstance");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

/**Setup Server properties */
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!

var firebase = require("firebase");
var fire_instance = firebase.initializeApp({
  apiKey: "AIzaSyBmRx-yPP-MyLYqqVHJmyROvUFeYoesdGU",
  authDomain: "clickinggamebase.firebaseapp.com",
  databaseURL: "https://clickinggamebase.firebaseio.com",
  projectId: "clickinggamebase",
  storageBucket: "clickinggamebase.appspot.com",
  messagingSenderId: "1029882586283",
  appId: "1:1029882586283:web:24e30c42bdf50215b9c3ee"
});

app.use(index);
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

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
  });
  

  socket.on("join", function(data) {
    console.log("New Player joined with name : " + data.name);
    GameInstance.getInstance().addPlayer({
      name: data.name,
      id: data.id,
      score: 20
    });
  });



  socket.on("disconnect", () => {
    console.log(
      "Player Disconnected " +  GameInstance.getInstance().getPlayer());
    //GameInstance.getInstance().removePlayer(socket.id);
  });
});

const getGameStateAndEmit = async socket => {
  try {
    socket.emit("GameInstance", GameInstance.getInstance()); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

const getRoomInstancesAndEmit = async socket => {
  try {
    const snapshot = await firebase
      .firestore()
      .collection("rooms")
      .get();

    socket.emit(
      "Rooms",
      snapshot.docs.map(doc => doc.data())
    ); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error Room Instances: ${error.code}`);
  }
};

const getPlayerBySocketId = socket => {
  for (let i = 0; i < GameInstance.players; i++) {
    if (GameInstance.players[i].id == socket.id) return GameInstance.players[i];
  }
  return null;
};
