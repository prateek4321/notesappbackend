const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
function authenticator(req, res, next) {
  // everytime we post data, we check everytime the user is authenticated or not
  // authorisation tokens to be send in headers, (authorization below is the key when we are making api calls)
  const token = req.headers.authorization; // these headers have that token(authorisaiton ones)
  // check if token is valid or not
  jwt.verify(token, "prateek", (err, decode) => {
    if (err)
      return res.send({
        message: "token is not valid please login",
        status: 2, // status 2 means we need to login
      });
    // verifying the token with the secret key sended (prateek)
    if (decode) {
      // add the user id inside particular title and body object, so it inserts in database that which user has
      // created the note
      req.body.user = decode.userId; // decode include the user whihc is going to create a note
      // above data is modified
      next();
    } else {
      res.send({
        message: "token is not valid please login",
        status: 2, // status 2 means we need to login
      });
    }
  });
}

module.exports = {
  authenticator,
};
