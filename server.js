const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongodb-session")(session);
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const { Server } = require("socket.io");

const app = require("./app");
const connectToMongoDB = require("./config/chatDb");
const Menu = require("./models/menuModel");
const Chat = require("./models/chatModel");
const User = require("./models/userModel");
const Order = require("./models/orderModel");
const { emit } = require("process");

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "127.0.0.1";
const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;
const COOKIE_EXPIRATION_TIME = process.env.COOKIE_EXPIRATION_TIME;
const httpServer = http.createServer(app);

connectToMongoDB()
  .then(
    httpServer.listen(PORT, HOST, () => {
      console.log("Server running on port", PORT);
    })
  )
  .catch(() => {
    console.log(
      "Server could not be started because connection to MongoDB failed."
    );
  });

const io = new Server(httpServer);

const wrap = (midddleware) => (socket, next) =>
  midddleware(socket.request, {}, next);

const store = new MongoStore({
  uri: MONGODB_CONNECTION_URL,
  collection: "sessions",
});

store.on("error", (error) => {
  console.log(error);
});

const sessionMW = session({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: {
    secure: false,
    maxAge: +COOKIE_EXPIRATION_TIME,
    domain: "http://mealicious-bot.onrender.com/",
  }, // Set secure to true if using HTTPS
});

// MIDDLEWARES
app.use(sessionMW);
app.use(cookieParser());
io.use(wrap(sessionMW));

//CONECTION TO socket io
io.on("connection", async (socket) => {
  const menu = await Menu.find({}).sort({ dishNo: 1 });
  const optionsJSON = await fs.readFile(
    path.join(__dirname, "public", "options.json"),
    "utf-8"
  );
  const options = JSON.parse(optionsJSON);
  const session = socket.request.session;
  console.log(session.userId);
  let userID = session.userId;
  let user;

  if (!userID) {
    userID = uuidv4();
    session.userId = userID;
    session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
      } else {
        console.log("Saved user ID to session:", userID);
      }
    });
    user = await User.create({ userId: userID });
  } else {
    user = await User.findOne({ userId: userID });
  }
  console.log(session.userId);
  // Load Chat History

  const userChatHistory = await Chat.find({
    userId: user._id,
  });
  socket.emit("onload", {
    chatHistory: userChatHistory,
    opts: Object.values(options[0]),
  });

  // Save Chat
  socket.on("saveMsg", async (chat, isBotMsg) => {
    const chatMsg = await Chat.create({
      userId: user._id,
      chatMsg: chat,
      isBotMsg,
    });
    // console.log(chatMsg);
  });

  socket.on("Msg", async (chat) => {
    const selectedItems = chat.split(",");
    let orders = menu.filter((item) => selectedItems.includes(item.dishNo));
    session.orders = orders;
    // console.log(session.orders);
    const orderingPattern = /^[2-9](,[2-9])*$/;
    switch (true) {
      case chat === "1":
        socket.emit("botResponse", { type: "menu", data: menu });
        break;

      case chat === "99":
        if (session.currentOrder) {
          // Save order to database
          const ordersId = session.currentOrder.map((order) => order._id);
          await Order.create({ orders: ordersId, userId: user._id });
          socket.emit("botResponse", {
            type: null,
            data: { message: options[1].checkout },
          });
          session.currentOrder = undefined;
          session.save((err) => {
            if (err) {
              console.log(err);
            }
          });
        } else {
          socket.emit("botResponse", {
            type: "invalidInput",
            data: { message: "No order to checkout, please place an order." },
          });
        }
        break;

      case chat === "98":
        // order history logic
        const orderHistory = await Order.find({ userId: user._id }).populate(
          "orders"
        );
        if (orderHistory.length) {
          socket.emit("botResponse", {
            type: "orderHistory",
            data: orderHistory,
          });
        } else {
          socket.emit("botResponse", {
            type: null,
            data: {
              message:
                "You have not placed and checked out any order with us yet..",
            },
          });
        }
        break;

      case chat === "97":
        // current order logic
        if (session.currentOrder) {
          socket.emit("botResponse", {
            type: "currentOrder",
            data: session.currentOrder,
          });
        } else {
          socket.emit("botResponse", {
            type: null,
            data: {
              message:
                "you don't have a current order with us, please place an order.",
            },
          });
        }
        break;

      case chat === "0":
        // cancelOrder logic
        if (session.currentOrder) {
          socket.emit("botResponse", {
            type: null,
            data: { message: "Order cancelled" },
          });
          session.currentOrder = undefined;
          session.save((err) => {
            console.log(err);
          });
        } else {
          socket.emit("botResponse", {
            type: null,
            data: { message: "You don't have any order here to cancel." },
          });
        }
        break;

      case orderingPattern.test(chat):
        const selectedItems = chat.split(",");
        let orders = menu.filter((item) =>
          selectedItems.includes(item.dishNo.toString())
        );
        if (orders.length) {
          socket.emit("botResponse", { type: "currentOrder", data: orders });
          session.currentOrder = orders;
          session.save((err) => {
            if (err) {
              console.log(err);
            }
          });
        }
        break;

      default:
        socket.emit("botResponse", {
          type: "invalidInput",
          data: {
            message: "Invalid input",
          },
        });
        break;
    }
  });
});
