const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const menuSchema = new Schema({
  dishNo: String,
  dishType: String,
  name: String,
  price: Number,
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;

// const menu = [
//   { name: "Rice and beef", price: "1200", dishType: "Main", dishNo: "2" },
//   {
//     name: "rice and chicken",
//     price: "1500",
//     dishType: "Appetizer",
//     dishNo: "3",
//   },
//   {
//     name: "bean and plantain ",
//     price: "1000",
//     dishType: "Dessert",
//     dishNo: "4",
//   },
//   { name: "bean and bread ", price: "1200", dishType: "Dessert", dishNo: "5" },
//   { name: "bean and bread ", price: "1200", dishType: "Dessert", dishNo: "6" },
//   { name: "porrage", price: "800", dishType: "Dessert", dishNo: "7" },
//   {
//     name: "noodles and chicken",
//     price: "1300",
//     dishType: "Dessert",
//     dishNo: "8",
//   },
//   {
//     name: "jollof spagetti and chicken",
//     price: "1500",
//     dishType: "Dessert",
//     dishNo: "9",
//   },
// ];

// (async () => {
//   const res = await Menu.create(menu);
//   console.log(res);
// })();
