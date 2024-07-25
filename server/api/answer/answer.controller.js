const { StatusCodes } = require("http-status-codes");
const { answerTable, getAnswerById } = require("./answer.service");

module.exports = {
  giveAnswer: (req, res) => {
    const { answer } = req.body;

    if (!answer)
      return res.this
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "answer field is not is filled" });
    answerTable(req.body, (err, result) => {
      if (err)
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ msg: "Database connection error" });
      return res
        .status(StatusCodes.OK)
        .json({ msg: "your answer is posted sucessesfully", data: result });
    });
  },

  getAnswer: (req, res) => {
    console.log(req.body);
    getAnswerById(req.body, (err, results) => {
      if (err)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          msg: "Database connection error!",
        });
      return res.status(StatusCodes.OK).json({
        data: results,
      });
    });
  },
};
