const express = require("express"); // to start the server
const cors = require("cors");
const { connection } = require("./db"); // giving access to its functions
const { userRouter } = require("./routes/user.routes");
const { noteRouter } = require("./routes/note.routes");
require("dotenv").config();
const port = process.env.PORT; // so that we do not have to use this large syntax everytime
const app = express();
app.use(cors());
app.use(express.json()); // evrything coming in json file will be converted to object to stoer in database
app.use("/user", userRouter); // everthing coming to this port we are going to route it to userRouter
app.use("/note", noteRouter); // when /note used we route it to noterouter
app.get("/", (req, res) => {
  res.send({
    message: "api is working now",
  });
});

app.listen(port, async () => {
  // try catch for connection, if not established then catch
  try {
    await connection;
    console.log("database is connected");
  } catch (error) {
    console.log(error);
  }
  console.log("server is running on port number", port);
});
