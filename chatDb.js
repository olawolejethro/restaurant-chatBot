const mongoose = require("mongoose");

async function mongoDbConnection() {
  try {
    await mongoose.connect("mongodb://localhost:27017/chatBot");
    console.log("Connection to MongoDB Successful!");
  } catch (error) {
    console.log(error, "Connection to MongoDB failed!");
  }
}
module.exports = mongoDbConnection;
