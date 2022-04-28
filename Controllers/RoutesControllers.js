// import { compare, hash } from "bcrypt";
// import User from "../Models/User";
const bcrypt = require("bcrypt");
const User = require("../Models/User.js");

//Landing page router for  GET  request on '/'  ==============
exports.landing_page = (req, res) => {
    //res.render("landing");
    res.send("Landing Page");
}
  
//Login page router for GET request on '/login' ==============
exports.login_get =(req, res) =>{
    const error = req.session.error;
    delete req.session.error;
    //res.render("login", { err: error });
    //res.send("Login Page",{err:error});
    res.status(200).send("Login Page");
}

//Login page router for POST request on '/login' ==============
exports.login_post = async (req, res) => {
    //Taking out email and password from request body
    const { email, password } = req.body;   
  
    //Checking the db for entered user email  
    const user = await User.findOne({ email });
  
    //If no such user email is found in db - Error message of "user not registered"
    if (!user) {
      req.session.error = "User not registered. Please register";
      //return res.redirect("/login");
      return res.send("User Not Found");
    }
  
    //If user is found- then password matched with password stored in db
    const isMatch = await bcrypt.compare(password, user.password);
    //If password entered in login form is incorrect -Error message of "Invalid Credentials"
    if (!isMatch) {
      req.session.error = "Invalid Credentials";
      //return res.redirect("/login");
      return res.send("Invalid Credentials");
    }
    //Storing the session of user if everything is correct
    req.session.isAuth = true;
    req.session.username = user.username;
    //res.redirect("/dashboard");
    res.status(200).send("Logged in Successfully");
    
}

//Register route for GET request on '/register' ====================
exports.register_get = (req, res)=> {
    const error = req.session.error;
    delete req.session.error;
    //res.render("register", { err: error });
    res.send("Register Page");
}

//Register route for POST request on '/register' ====================
exports.register_post = async (req, res) =>{
    //Taking out username,email,password from request body
    const { username, email, password } = req.body;
  
   //Finding if the provided email is already registered with any user in db
    let user = await User.findOne({ email });
  
   //If provided email is already registered with any user inside db
    if (user) {
      req.session.error = "User already exists";
      //return res.redirect("/register");
      return res.send("User already exists");
    }
   //If the user is new, the password is hashed before storing to db
    const hasdPsw = await bcrypt.hash(password, 12);
  
    user = new User({
      username,
      email,
      password: hasdPsw,
    });
   //The details of new user with hashed password is stored in db
    await user.save();
    //res.redirect("/login");
    res.status(201).send("User registered - Now please login");
}

//Main dashboard router -checking the session if non logined user enter============s
exports.dashboard_get = (req, res) => {
    const username = req.session.username;
    //res.render("dashboard", { name: username });
    res.send(`Dashboard ${username}`);
}

//Logout router - destroyes the session of user in db =============
exports.logout_post = (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      //res.redirect("/login");
      res.send("Login again to continue");
    });
}
  

  
  