const express = require("express");
const { UserModel } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { NoteModel } = require("../models/NoteModel");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
userRouter.get("/", (req, res) => {
  res.send("all the user"); // this message if shown on localhost:4000/user, it means it is routing perfectly to here
});
userRouter.post("/register", async (req, res) => {
  // if its register point, if user is new we need to hash its password and then store
  const { name, email, password } = req.body; // from the body it will get the data
  bcrypt.hash(password, 5, async function (err, hash) {
    if (err) return res.send({ message: "something went wrong", status: 0 });
    try {
      let user = new UserModel({ name, email, password: hash });
      await user.save(); // insert a single data in database in mongodb
      res.send({
        message: "user created",
        status: 1,
      });
    } catch (error) {
      res.send({
        message: error.message,
        status: 0,
      });
    }
  });
});
// now login router and compare the password
userRouter.post("/login", async (req, res) => {
  // going to log in so post and we now verify the user and password for log in
  const { email, password } = req.body;
  let option = {
    // after this time limit exceeds and if you want to access something from the database we need token(and after the token)
    // expires the database will not give us the data
    // so token needed to retrieve data from the database (like -this user is logged in for 3 min and till this time it can
    // access things from database)(authenticated time)
    expiresIn: "3m",
  };
  try {
    // used note model down before, mistake
    let data = await UserModel.find({ email }); // finding email we have as already registered
    if (data.length > 0) {
      // if we have a email as already registerd the length >0
      let token = jwt.sign({ userId: data[0]._id }, "prateek"); // prateek is secret key and this user id and other details
      // are signed using jwt as digital identity card
      // yes some person is already registered
      bcrypt.compare(password, data[0].password, function (err, result) {
        // data[0].password(now comparison of both hashed and non hashed password will take place)
        // it will compare the password now
        if (err)
          return res.send({
            message: "something went wrong:" + err,
            status: 0,
          });
        if (result) {
          res.send({
            message: "user logged in successfully",
            token: token, // token passed by server for user to make further api calls become easy now(digital identity card)
            status: 1,
          });
        } else {
          res.send({
            message: "Incorrect password",
            status: 0,
          });
        }
      });
    } else {
      res.send({
        message: "user does not exist",
        status: 0, // status 0 means false nothing happened there
      });
    }
  } catch (error) {
    res.send({
      message: error.message,
      status: 0,
    });
  }
});
module.exports = { userRouter }; // export so that other files can use it
