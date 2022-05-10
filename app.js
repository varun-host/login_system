const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const config = require("config");
const appController = require( "./Controllers/RoutesControllers.js");
const isAuth = require("./Middlewares/is-auth.js");
const connectDB = require ("./config/db");
const mongoURI = config.get("mongoURI");
const app = express();
const bodyParser = require('body-parser');
//const PORT = process.env.PORT || 6000;

connectDB();
//Session collection to store sessions of logged in users=====
const store = new MongoDBStore({
  uri: mongoURI,
  collection: "mySessions",
});
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//=================== Routes =============================
// Landing Page
app.get("/", appController.landing_page);
// Login Page
app.get("/login", appController.login_get);
app.post("/login", appController.login_post);
// Register Page
app.get("/register", appController.register_get);
app.post("/register", appController.register_post);
// Dashboard Page
app.get("/dashboard", isAuth, appController.dashboard_get);
//Logout
app.post("/logout", appController.logout_post);

app.listen(console.log(`App Running on https://smartaiassistant.herokuapp.com/`));
