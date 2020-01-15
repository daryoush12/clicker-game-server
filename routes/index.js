const express = require("Express");
const router = express.Router();
const GameInstance = require("../Game/GameInstance");
const GameInstancesManager = require("../Game/GameInstance");



router.get("/", (req, res ) => {
    res.send({response: "I am alive."}).status(200);
});

router.get("/rooms", (req, res) => {

});

router.post("/rooms/new", (req, res) => {

    var name = req.param('name');
    var creator = req.param('roomcreator')
    var test = new GameInstance(name);
    res.send({"response": test}).status(200);
  

});



module.exports = router;