require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRouter = require("./server/api/users/user.router");
const questionRouter = require("./server/api/question/Question.router");
const answerRouter = require("./server/api/answer/answer.router");
const app = express();
const pool = require("./server/config/dbConfig");
const port = process.env.PORT;

app.use(cors()); //middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users", userRouter);

app.use("/api/questions", questionRouter);

app.use("/api/answers", answerRouter);

app.listen(port, () => {
  console.log(`listing on port ${port}`);
});
