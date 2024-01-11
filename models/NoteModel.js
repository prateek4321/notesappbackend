const mongoose = require("mongoose");
const noteSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    user: { type: String, required: true }, // user id of preson who created the note
  },
  {
    versionKey: false,
  }
);
const NoteModel = mongoose.model("note", noteSchema);
module.exports = {
  NoteModel,
};
