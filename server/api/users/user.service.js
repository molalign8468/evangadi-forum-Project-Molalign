const pool = require("../../config/dbConfig");
module.exports = {
    
    register: (data, callback)=>{
        pool.query(`INSERT INTO registration(user_name, user_email,user_password)VALUES(?,?,?)`, 
        [
            data.userName,
            data.email,
            data.password
        ],
        (err, result)=>{
            if(err) return callback(err);
            return callback(null, result);
        });
    },

    profile: (data, callback)=>{ 
        // this "callback" is a function to be called when the database query is complete

        pool.query(`INSERT INTO profile(user_id, first_name,last_name)VALUES(?,?,?)`, 
        [
            data.userId,
            data.firstName,
            data.lastName
        ],
        (err, result)=>{
            if(err) return callback(err);
            return callback(null, result);
        });
    },



    //  retrieves user information from a database based on a user ID
    userById: (id, callback)=>{
        pool.query(`SELECT registration.user_id, user_name, user_email, first_name, last_name FROM registration LEFT JOIN profile ON registration.user_id = profile.user_id WHERE registration.user_id = ?`, [id],
        (err, result)=>{
            if(err) return callback(err);
            return callback(null, result[0]);
        });
    },

    //  retrieves user information from a database based on a user email

    getUserByEmail: (email, callback)=>{
        pool.query(`SELECT * FROM registration WHERE user_email = ?`,[email],
        (err, result)=>{
            if(err) return callback(err);
            return callback(null, result[0]);
        });
    },

    
    getAllUsers: (callback)=>{
        pool.query(`SELECT * FROM registration`,
        (err, result)=>{
            if(err) return callback(err);
            return callback(null, result);
        });
    },



}
