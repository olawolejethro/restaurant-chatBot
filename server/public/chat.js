import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io("http://localhost:8000");
const chatHistory = document.getElementById("chat-history");
const chatInput = document.getElementById("chat-input");
const userInput = document.getElementById("user-input");

chatInput.addEventListener("submit", (e) => {
  e.preventDefault();
  const chat = userInput.value.trim();
  if (chat) {
    displayMessage(chat, false);
    socket.emit("saveMsg", chat, false);
    userInput.value = "";
    socket.emit("Msg", chat);
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
socket.on("botResponse", ({ type, data }) => {
  switch (type) {
    case "menu":
      displayMenu(data, true);
      break;

    case "checkout":
      displayCheckout(data, true);
      break;

    case "order":
      const storedOrders = localStorage.setItem("data", data);
      console.log(storedOrders);
      displayOrder(data, true);
      break;

    default:
      break;
  }
});

function displayMessage(message, isBotMsg) {
  const chatMessage = document.createElement("div");
  chatMessage.className = `chat-message ${isBotMsg ? "bot" : "user"}-message`;
  chatMessage.innerHTML = message;
  chatHistory.insertAdjacentElement("beforeend", chatMessage);
}

function displayChatHistory(userChatHistory) {
  userChatHistory.forEach((history) => {
    displayMessage(history.chat, history.isBotMsg);
  });
}

function displayOptions(optsArray) {
  const htmlFormattedOpts = `<p><ul>${optsArray
    .map((opt) => `<li>${opt}</li>`)
    .join("")}</ul></p>`;
  displayMessage(htmlFormattedOpts, true);
}

function displayMenu(menu) {
  const htmlFormattedOpts = `<p><ol start=2>${menu
    .map(
      (item) => `<li>${item.dishType} => ${item.name} => $${item.price}</li>`
    )
    .join("")}</ol></p>`;
  displayMessage(htmlFormattedOpts, true);
}

function displayGreetings() {
  const greeting = `<p>Welcome!</p>`;
  displayMessage(greeting, true);
}
function displayOrder(orders) {
  const total = orders.reduce((prev, item) => prev + item.price, 0);
  const htmlFormattedOpts = `<p><ul>${orders
    .map(
      (item) => `<li>${item.dishType} => ${item.name} => $${item.price}</li>`
    )
    .join("")} Total => ${total}</ul></p>`;
  displayMessage(htmlFormattedOpts, true);
}
function displayCheckout() {
  const htmlFormattedOpts = `<p>cool!!!<br> order placed
 </p>`;
  displayMessage(htmlFormattedOpts, true);
}
