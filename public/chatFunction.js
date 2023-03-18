import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
export const socket = io("https://mealicious-bot.onrender.com");
// export const socket = io("https://localhost:8000");

const chatHistory = document.getElementById("chat-history");

function handleScrollToBottom() {
  chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: "smooth" });
}

function displayMessage(
  message,
  isBotMsg,
  saveToDB = true,
  dbChatTime = undefined
) {
  const timeStampOptions = { hour: "numeric", minute: "numeric" };
  const date = dbChatTime ? new Date(dbChatTime) : new Date();
  const dateString = date.toLocaleTimeString(undefined, timeStampOptions);
  const chatMessage = document.createElement("div");
  chatMessage.className = `chat-message ${isBotMsg ? "bot" : "user"}-message`;
  chatMessage.innerHTML = message;
  const chatTime = document.createElement("span");
  chatTime.className = `${isBotMsg ? "bot" : "user"}-time`;
  chatTime.textContent = dateString;
  chatHistory.insertAdjacentElement("beforeend", chatTime);
  chatHistory.insertAdjacentElement("beforeend", chatMessage);
  if (saveToDB) {
    socket.emit("saveMsg", message, isBotMsg);
  }
  handleScrollToBottom();
}

function displayChatHistory(userChatHistory) {
  userChatHistory.forEach((history) => {
    displayMessage(history.chatMsg, history.isBotMsg, false, history.createdAt);
  });
}

function displayOptions(optsArray) {
  const htmlFormattedResponse = `<p><ul>${optsArray
    .map((opt) => `<li>${opt}</li>`)
    .join("")}</ul>`;
  displayMessage(htmlFormattedResponse, true, false);
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
    .map((item) => `<li>${item.dishType}👉 ${item.name} 🥧 $${item.price}</li>`)
    .join("")}</ol></p>`;
  displayMessage(htmlFormattedResponse, true);
}

function displayGreetings() {
  const greeting = `<p>Welcome!</p>`;
  displayMessage(greeting, true, false);
}

function displayCurrentOrder(orders) {
  const total = orders.reduce((prev, item) => prev + item.price, 0);
  const htmlFormattedResponse = `<p>Current Order Summary
  <ul>${orders
    .map(
      (item) => `<li>${item.dishType} 👉 ${item.name} .🥧$${item.price}</li>`
    )
    .join("")} Total => ${total}</ul></p>`;
  displayMessage(htmlFormattedResponse, true);
}

const exports = {
  displayChatHistory,
  displayCurrentOrder,
  displayGreetings,
  displayMenu,
  displayMessage,
  displayOptions,
  displayOrderHistory,
  socket,
};

export default exports;
