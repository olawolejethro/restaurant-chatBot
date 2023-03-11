import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io("http://localhost:8000");

socket.io.on("error", (error) => {
  console.log(error);
});

socket.on("connect", () => {
  console.log(socket.id); // true
  socket.on("loadChatHistory", (userChatHistory) => {
    displayChatHistory(userChatHistory);
  });
  socket.on("botInitialMsg", (options) => {
    displayOptions(options);
  });
});

function displayChatHistory(userChatHistory) {
  const chatHistory = document.getElementById("chat-history");

  userChatHistory.forEach((history) => {
    const chatMessage = document.createElement("div");
    chatMessage.className = `chat-message ${
      history.isBotMsg ? "bot" : "user"
    }-message`;
    chatMessage.innerHTML = history.chat;
    chatHistory.insertAdjacentElement("beforeend", chatMessage);
  });
}

function displayOptions(optsArray) {
  const chatHistory = document.getElementById("chat-history");
  const chatMessage = document.createElement("div");
  chatMessage.className = "chat-message bot-message";
  const htmlFormattedGreeting =
    "<p>Welcome to our restaurant! How can I assist you?</p>";
  chatMessage.innerHTML = htmlFormattedGreeting;

  const chatMessageII = document.createElement("div");
  chatMessageII.className = "chat-message bot-message";
  const htmlFormattedOpts = `<p><ul>${optsArray
    .map((opt) => `<li>${opt}</li>`)
    .join("")}</ul></p>`;
  chatMessageII.innerHTML = htmlFormattedOpts;
  chatHistory.insertAdjacentElement("beforeend", chatMessage);
  chatHistory.insertAdjacentElement("beforeend", chatMessageII);
  // socket.emit("saveMsg", htmlFormattedGreeting, true);
  // socket.emit("saveMsg", htmlFormattedOpts, true);
}
