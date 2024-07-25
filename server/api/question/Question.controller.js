require("dotenv").config();
const pool = require("../../config/dbConfig");
const { StatusCodes } = require("http-status-codes");


const {
  questionTable,
  allQuestions,
  selectQestion,
} = require("./Qusetion.service");

module.exports = {
  askQuestion: (req, res) => {
    const { question  } = req.body;

    if (!question)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "question field must be provided" });
    questionTable(req.body, (err, results) => {
      if (err) {
        console.log(err);
        console.log(req.body)
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ msg: "Database connection error" });
      }
      return res
        .status(StatusCodes.OK)
        .json({ msg: "question added sucessusfully", data: results });
    });
  },
  getAllQusetions: (req, res) => {
    allQuestions((err, result) => {
      if (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ msg: "Database connection error" });
      }
      return res.status(StatusCodes.OK).json({
        questions: result,
      });
    });
  },

  getQuestion: (req, res) => {
    selectQestion(req.body, (err, result) => {
      if (err)
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ msg: "database connection error" });
      return res.status(StatusCodes.OK).json({
        data: result,
      });
    });
  },
};
