const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL;
async function mongoDbConnection() {
  try {
    await mongoose.connect(MONGODB_CONNECTION_URL);
    console.log("Connection to MongoDB Successful!");
  } catch (error) {
    console.log(error, "Connection to MongoDB failed!");
  }
}
module.exports = mongoDbConnection;
