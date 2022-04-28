const mongoose = require("mongoose");
// const db = "mongodb://localhost:27017/sessions";
const config = require("config");
const db = config.get("mongoURI");

//=========db Connection===============
const connectDB = async () => {
    try {
      await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
       // useCreateIndex: true,
      });
  
      console.log("MongoDB connected");
    } catch (error) {
      console.log("Something went wrong with Database connection");
      process.exit(1);
    }
};
  
module.exports =  connectDB;
  