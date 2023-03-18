# RESTAURANT BOT 📝

## Description

Restaurant Bot is an app with a chat screen interface where by users and bot interact together by placing order, checking our orders,confirming currentorders and cancelling orders. The chat bot is built in a way that it automatically greet a user and display the option in which the user will be able to interact with the bot efficiently.

Built as a project at [Altschool Africa School of Engineering 3rd semester exam - Node.js track](https://docs.google.com/document/d/1wI4Y7eIQy9Qs9sR9JLoJglNJp5B4i4rV2Ch6-JV-dfo/edit)

## Usage

The bot automatically send greetings and the display the options
The option contains
Select 1 to Place an order
Select 99 to checkout order
Select 98 to see order history
Select 97 to see current order
Select 0 to cancel order

User have to checkout order with 99 before the order can be placed and save in the database
Each user have a unique sesion ID and this ID is used to save all user message inside the database
After every reload the still get his/her chat history for future refrences
when user in put wrong input the bot responde with an in valid message and resend the options

### 1. Main Dependencies

- **node.js** and **express** as the JavaScript runtime environment and server framework
- **mongodb** as our database of choice
- **mongoose** as an ODM library of choice
- **socket.io** use for connecting the server and client and allow interaction between them
- **connect-mongodb-session** used as a store for each user session
- **express-session**express-session used for generating session -ID for each user

## Main Files: Project Structure

```sh
├── README.md *** Instructions on how to set-up the project locally and usasge of the app
├── package.json *** The dependencies to be installed with "npm install"
├── server.js
├── chat.js
├── app.js
├── config
│   ├── chatdb.js

```

## Getting Started Locally

### Prerequisites & Installation

To be able to get this application up and running, ensure to have [node](https://nodejs.org/en/download/) installed on your device.

### Development Setup

1. **Download the project locally by forking this repo and then clone or just clone directly via:**

```bash
git clone https://github.com/olawolejethro/restaurant-chatBot
```

2. **Install the dependencies** from the root directory, in terminal run:

```

npm install

```

3. **Set up the Database**
   - Create 2 MongoDB databases on your local MongoDB server or in the cloud (Atlas)
   - Copy the connection strings and assign it to the `MONGODB_CONNECTION_URL` and other environment variables in the example.env file each.
   - On connection to these databases, four collections - `users`,`chat`,`order`,`session`and `Menus` will be created.

## Models

### User

reponse of user saved in the Db

```json
{
  "_id": {
    "$oid": "641400a217ec90c89f58af50"
  },
  "userId": "5ce1b992-6e7e-46fd-90fd-fccff4c313d2",
  "orders": [],
  "__v": 0
}
```

### Chat

````json
{
"_id": {
"$oid": "641400382c6e47585776e744"
  },
  "userId": {
    "$oid": "641400342c6e47585776e741"
},
"chatMsg": "1",
"isBotMsg": false,
"createdAt": {
"$date": {
      "$numberLong": "1679032376274"
}
},
"__v": 0
}
|```


4. **Create a .env file**.

   - Copy and paste the content of `example.env` into this new `.env` file.

5. **Run the development server:**

```bash /command prompt
npm run dev
````

5. **At this point, your server should be up and running** at [http://127.0.0.1:8000/](http://127.0.0.1:8000/) or [http://localhost:8080](http://localhost:8080)

## Deployment

https://mealicious-bot.onrender.com/

## Authors

[olawole jethro](https://github.com/olawolejethro/restaurant-chatBot)

## Acknowledgements

Thanks to God, Altschool and my colleague for helping me thus far.
