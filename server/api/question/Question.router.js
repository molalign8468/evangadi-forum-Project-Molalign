const router = require("express").Router();

const {askQuestion, getAllQusetions,  getQuestion} = require("./Question.controller");
const auth = require("../middleware/auth");
// const auth = require("../middleware/auth")



router.post("/",  askQuestion)


router.get("/", getAllQusetions)


router.post("/id", getQuestion)

module.exports = router;