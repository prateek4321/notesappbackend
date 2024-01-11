const express = require("express");

// encrypting the user id, when we get data we receive the token from user end and we will decrypt it(and get user id)
// with this user id we can access any user data or a note model which is there in the databases and show it to the user
const { NoteModel } = require("../models/NoteModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticator } = require("../middlewares/authenticator");
const noteRouter = express.Router();
noteRouter.use(authenticator); // we now use the authenticator here now

noteRouter.get("/", async (req, res) => {
  // now getting  a note
  let token = req.headers.authorization; // because we are getting the token in the header so we need to initialize it first
  jwt.verify(token, "prateek", async (err, decode) => {
    try {
      let data = await NoteModel.find({ user: decode.userId }); // on basis of id we got the note from database
      res.send({
        data: data,
        message: "success",
        status: 1,
      });
    } catch (error) {
      res.send({
        message: error.message,
        status: 0,
      });
    }
    // we will not get the error of token expire because we have handled it in authenticator.js file
  });
});
// create our note
noteRouter.post("/create", async (req, res) => {
  // create note route (title user and body will be created)
  try {
    let note = new NoteModel(req.body); // creating a new note
    await note.save();
    res.send({
      message: "Note Created",
      status: 1,
    });
  } catch (error) {
    res.send({
      message: error.message,
      status: 0,
    });
  }
});

noteRouter.patch("/", async (req, res) => {
  // to update the note we use patch
  let { id } = req.headers; // we get the id and we update then
  try {
    await NoteModel.findByIdAndUpdate({ _id: id }, req.body); // so by this id it will find out and update (the payload
    // send as second parameter)
    res.send({
      message: "Note updated",
      status: 1,
    });
  } catch (error) {
    // otherwise error message shown
    res.send({
      message: error.message,
      status: 0,
    });
  }
});

noteRouter.delete("/", async (req, res) => {
  let { id } = req.headers;
  try {
    await NoteModel.findByIdAndDelete({ _id: id }); // deleting the node
    res.send({
      message: "Note deleted",
      status: 1,
    });
  } catch (error) {
    res.send({
      message: error.message,
      status: 0,
    });
  }
});
module.exports = {
  noteRouter,
};
