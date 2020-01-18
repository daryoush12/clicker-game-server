const express = require("Express");
const router = express.Router();

router.get("/", (req, res ) => {
    res.send({response: "Connection ok."}).status(200);
});

module.exports = router;