const GameInstance = require("./Game/GameInstance");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
var cors = require('cors')

/**Setup Server properties */
const port = process.env.PORT || 3000;
const index = require("./routes/index");
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!


app.use(cors())

app.use('/static', express.static(path.join(process.cwd(), '.build')));

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
