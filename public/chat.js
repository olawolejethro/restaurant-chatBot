import chatFunction from "./chatFunction.js ";
// import {moment} from ("moment");
const socket = chatFunction.socket;
let options;
const chatInput = document.getElementById("chat-input");
const userInput = document.getElementById("user-input");
// const chatMessages = document.querySelector(".chat-message");

chatInput.addEventListener("submit", (e) => {
  e.preventDefault();
  const chat = userInput.value.trim();
  if (chat) {
    chatFunction.displayMessage(chat, false);
    userInput.value = "";
    socket.emit("Msg", chat);
  } else {
    chatFunction.displayMessage("Please input something.", true);
  }
});

socket.io.on("error", (error) => {
  console.log(error);
});

// socket.on("connect", () => {
//   displayBotimage();
// });

socket.on("onload", ({ chatHistory, opts }) => {
  options = opts;
  chatFunction.displayGreetings();
  chatFunction.displayOptions(options);
  chatFunction.displayChatHistory(chatHistory);
});

socket.on("botResponse", ({ type, data }) => {
  switch (type) {
    case "menu":
      chatFunction.displayMenu(data, true);
      break;

    case "currentOrder":
      chatFunction.displayCurrentOrder(data);
      break;
    case "orderHistory":
      chatFunction.displayOrderHistory(data, true);
      break;
    case "cancelOrder":
      // window.localStorage.getItem(storedOrders)
      chatFunction.deleteOrder(data, true);
      break;

    case "invalidInput":
      chatFunction.displayMessage(data.message, true);
      chatFunction.displayOptions(options);
      break;
    default:
      chatFunction.displayMessage(data.message, true);
      break;
  }
});

// function handleScrollToBottom() {
//   chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: "smooth" });
// }

// function displayMessage(
//   message,
//   isBotMsg,
//   saveToDB = true,
//   dbChatTime = undefined
// ) {
//   const timeStampOptions = { hour: "numeric", minute: "numeric" };
//   const date = dbChatTime ? new Date(dbChatTime) : new Date();
//   const dateString = date.toLocaleTimeString(undefined, timeStampOptions);
//   const chatMessage = document.createElement("div");
//   chatMessage.className = `chat-message ${isBotMsg ? "bot" : "user"}-message`;
//   chatMessage.innerHTML = message;
//   const chatTime = document.createElement("span");
//   chatTime.className = `${isBotMsg ? "bot" : "user"}-time`;
//   chatTime.textContent = dateString;
//   chatHistory.insertAdjacentElement("beforeend", chatTime);
//   chatHistory.insertAdjacentElement("beforeend", chatMessage);
//   if (saveToDB) {
//     socket.emit("saveMsg", message, isBotMsg);
//   }
//   handleScrollToBottom();
// }

// function displayChatHistory(userChatHistory) {
//   userChatHistory.forEach((history) => {
//     displayMessage(history.chatMsg, history.isBotMsg, false, history.createdAt);
//   });
// }

// function displayOptions(optsArray) {
//   options = optsArray;
//   const htmlFormattedResponse = `<p><ul>${optsArray
//     .map((opt) => `<li>${opt}</li>`)
//     .join("")}</ul>`;
//   displayMessage(htmlFormattedResponse, true, false);
// }

// function displayBotimage() {
//   const htmlFormattedResponse = `<span class="date">5:42</span>`;
//   // displayMessage(htmlFormattedResponse, true);
// }
// function displayOrderHistory(orders) {
//   console.log(orders);
//   const htmlFormattedResponse = `<p><ul>${orders
//     .map(
//       (order) => `<li>${order.orders.map((item) => item.name).join("")}</li>`
//     )
//     .join("")}</ul></p>`;
//   displayMessage(htmlFormattedResponse, true);
// }

// function displayMenu(menu) {
//   const htmlFormattedResponse = `<p><ol start=2>${menu
//     .map(
//       (item) => `<li>${item.dishType} => ${item.name} => $${item.price}</li>`
//     )
//     .join("")}</ol></p>`;
//   displayMessage(htmlFormattedResponse, true);
// }

// function displayGreetings() {
//   const greeting = `<p>Welcome!</p>`;
//   displayMessage(greeting, true, false);
// }

// function displayCurrentOrder(orders) {
//   const total = orders.reduce((prev, item) => prev + item.price, 0);
//   const htmlFormattedResponse = `<p>Current Order Summary
//   <ul>${orders
//     .map(
//       (item) => `<li>${item.dishType} => ${item.name} => $${item.price}</li>`
//     )
//     .join("")} Total => ${total}</ul></p>`;
//   displayMessage(htmlFormattedResponse, true);
// }
