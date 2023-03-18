import chatFunction from "./chatFunction.js ";
const socket = chatFunction.socket;
let options;
const chatInput = document.getElementById("chat-input");
const userInput = document.getElementById("user-input");

//Tracking user input and adding event listener
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

socket.on("onload", ({ chatHistory, opts }) => {
  options = opts;
  chatFunction.displayGreetings();
  chatFunction.displayOptions(options);
  chatFunction.displayChatHistory(chatHistory);
});
// Listeners
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
