const express = require("Express");
const router = express.Router();
const GameInstance = require("../Game/GameInstance");
const GameInstancesManager = require("../Game/GameInstance");


router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://clicker-client-dare.herokuapp.com/"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

router.get("/", (req, res ) => {
    res.send({response: "Connection ok."}).status(200);
});

module.exports = router;