require('dotenv').config();
const {StatusCodes} = require("http-status-codes");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) =>{
    try {
        // console.log(req.headers);
        const token = req.header("x-auth-token");
        if(!token)
        return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({msg: 'No authentication token, authorization denied.'});

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('verified',verified);
        if(!verified)
        return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({msg: "Token verification failed, authorization denied."});

        req.id = verified.id;
        // console.log(`request`,req.id);
        next();
    } catch (err) {
        res.status().json({error: err.message});
    }
};

module.exports = auth;