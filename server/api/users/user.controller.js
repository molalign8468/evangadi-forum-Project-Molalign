require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const {
  register,
  profile,
  userById,
  getUserByEmail,
  getAllUsers,
} = require("./user.service");
const pool = require("../../config/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: (req, res) => {
    const { userName, firstName, lastName, email, password } = req.body;

    // to validate empty fields

    //variable is considered falsy if its value is false, 0, an empty string (""), null, undefined, NaN, or an empty array ([]).

    if (!userName || !firstName || !lastName || !email || !password)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Not all fields have been provided!" });

    // to validate password strength
    if (password.length < 8)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must be atleast 8 characters!" });

    //check if the email is used before

    pool.query(
      `SELECT * FROM registration WHERE user_email = ?`,
      [email],
      (err, results) => {
        if (err) {
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "Database connection error" });
        }

        if (results.length > 0) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "An account with this email already exists!" });
        } else {
          //encrpting password
          const salt = bcrypt.genSaltSync();
          req.body.password = bcrypt.hashSync(password, salt);

          register(req.body, (err, results) => {
            if (err) {
              console.log(err);
              return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ msg: "Database connection error" });
            }
            // console.log(results)

            req.body.userId = results.insertId;
            profile(req.body, (err, results) => {
              if (err) {
                console.log(err);
                return res
                  .status(StatusCodes.INTERNAL_SERVER_ERROR)
                  .json({ msg: "Database connection error" });
              }
              return res.status(200).json({
                msg: "New user added successfully",
                data: results,
              });
            });
          });
        }
      }
    );
  },
  getUsers: (req, res) => {
    getAllUsers((err, results) => {
      if (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ msg: "Database connection error" });
      }
      return res.status(StatusCodes.OK).json({
        Number_Of_Users: results.length,
      });
    });
  },
  getUserById: (req, res) => {
    userById(req.id, (err, results) => {
      if (err) {
        console.log(err);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ msg: "database connection err" });
      }
      if (!results) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: "Record not found" });
      }
      return res.status(StatusCodes.OK).json({ data: results });
    });
  },
  login: (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    if (!email || !password)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Not all fields have been provided" });

    getUserByEmail(email, (err, results) => {
      if (err) {
        console.log(err);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ msg: "Database connection error" });
      }
      if (!results) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: "No account with this email has been registered" });
      }
      const isMatch = bcrypt.compareSync(password, results.user_password);
      if (!isMatch)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: "Invalid Credentials" });
      const token = jwt.sign({ id: results.user_id }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });
      return res.json({
        token: token,
        user: {
          id: results.user_id,
          display_name: results.user_name,
        },
      });
    });
  },
};
