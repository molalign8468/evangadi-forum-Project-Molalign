const router = require("express").Router();
const auth = require("../middleware/auth");

const {giveAnswer, getAnswer} = require("./answer.controller");

router.post('/',  giveAnswer );

router.post('/all',   getAnswer)


module.exports = router;
