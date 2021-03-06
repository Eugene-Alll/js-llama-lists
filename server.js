var morgan       = require("morgan"),
    express      = require("express"),
    mongoose     = require("mongoose"),
    passport     = require("passport"),
    bodyParser   = require("body-parser"),
    expressJwt   = require("express-jwt"), // middleware that validates JsonWebTokens
    jwt          = require("jsonwebtoken"), // used to create, sign, and verify tokens
    port         = process.env.PORT || 3000,
    app          = express();

var configDB   = require("./config/database.js"); // get link on bd
var configAuth = require("./config/auth"); // get auth

mongoose.connect(configDB.url); // connect to database

app.use(express.static(__dirname + "/public")); // sets the static files location to public
app.use(express.static(__dirname + "/public/scripts/core"));
app.use(express.static(__dirname + "/public/scripts/common"));

app.use(morgan("dev")); // log every request to the console
app.use(bodyParser.json({ limit: "1mb" })); // get information from html forms
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true })); // support encoded bodies
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

// We are going to protect /api routes with JWT
app.use("/api", expressJwt({
  secret: configAuth.secret
}));

// catch unauthorization error
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({ success: false, message: 'Unauthorized request' });
  }
});

app.set("mylittlesecret", configAuth.secret);

// routes ======================================================================
require("./app/mainRoute.js")(app); // load our routes and pass in our app and fully configured passport

module.exports.app = app;
app.listen(port, function() {
  console.log("Magic happens on this " + port + " port");
});
