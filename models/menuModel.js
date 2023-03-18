const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const menuSchema = new Schema({
  dishNo: Number,
  dishType: String,
  name: String,
  price: Number,
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;

