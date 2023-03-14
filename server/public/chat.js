import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io("http://localhost:8000");
let options;
const chatHistory = document.getElementById("chat-history");
const chatInput = document.getElementById("chat-input");
const userInput = document.getElementById("user-input");
const chatMessages = document.querySelector(".chat-message");
chatInput.addEventListener("submit", (e) => {
  e.preventDefault();
  const chat = userInput.value.trim();
  if (chat) {
    displayMessage(chat, false);
    userInput.value = "";
    socket.emit("Msg", chat);
    // socket.emit("saveMsg", chat, false);
  } else {
    displayMessage("Please input something.", true);
  }
});

socket.io.on("error", (error) => {
  console.log(error);
});

socket.on("connect", () => {
  displayGreetings();
});

socket.on("loadChatHistory", (userChatHistory) => {
  displayChatHistory(userChatHistory);
});
socket.on("botInitialMsg", (options) => {
  displayOptions(options);
});
socket.on;
socket.on("botResponse", ({ type, data }) => {
  switch (type) {
    case "menu":
      displayMenu(data, true);
      break;

    case "currentOrder":
      displayCurrentOrder(data);
      break;
    case "orderHistory":
      displayOrderHistory(data, true);
      break;
    case "cancelOrder":
      // window.localStorage.getItem(storedOrders)
      deleteOrder(data, true);
      break;

    case "invalidInput":
      displayMessage(data.message, true);
      displayOptions(options);
      break;
    default:
      displayMessage(data.message, true);
      break;
  }
});

function handleScrollToBottom() {
  chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: "smooth" });
}

function displayMessage(message, isBotMsg) {
  const chatMessage = document.createElement("div");
  chatMessage.className = `chat-message ${isBotMsg ? "bot" : "user"}-message`;
  chatMessage.innerHTML = message;
  chatHistory.insertAdjacentElement("beforeend", chatMessage);
  handleScrollToBottom();
}

function displayChatHistory(userChatHistory) {
  userChatHistory.forEach((history) => {
    displayMessage(history.chat, history.isBotMsg);
  });
}

function displayOptions(optsArray) {
  options = optsArray;
  const htmlFormattedResponse = `<p><ul>${optsArray
    .map((opt) => `<li>${opt}</li>`)
    .join("")}</ul></p>`;
  displayMessage(htmlFormattedResponse, true);
}

function displayOrderHistory(orders) {
  console.log(orders);
  const htmlFormattedResponse = `<p><ul>${orders
    .map(
      (order) => `<li>${order.orders.map((item) => item.name).join("")}</li>`
    )
    .join("")}</ul></p>`;
  displayMessage(htmlFormattedResponse, true);
}

function displayMenu(menu) {
  const htmlFormattedResponse = `<p><ol start=2>${menu
    .map(
      (item) => `<li>${item.dishType} => ${item.name} => $${item.price}</li>`
    )
    .join("")}</ol></p>`;
  displayMessage(htmlFormattedResponse, true);
}

function displayGreetings() {
  const greeting = `<p>Welcome!</p>`;
  displayMessage(greeting, true);
}

function displayCurrentOrder(orders) {
  const total = orders.reduce((prev, item) => prev + item.price, 0);
  const htmlFormattedResponse = `<p>Current Order Summary
  <ul>${orders
    .map(
      (item) => `<li>${item.dishType} => ${item.name} => $${item.price}</li>`
    )
    .join("")} Total => ${total}</ul></p>`;
  displayMessage(htmlFormattedResponse, true);
}
