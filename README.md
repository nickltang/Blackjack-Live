# Blackjack-Live
A web-based blackjack game with video chat room functionality. Gameplay is single player for now-- other users are able to join a game room with an active player and spectate the game while video chatting.

## Tech Stack
- Frontend
  - ReactJS
  - Bootstrap
- Backend
  - Express/node.js
  - MongoDB
- Miscellaneous
  - Socket.io, Websockets
  - Peerjs, Web-RTC

## Instructions to Run Locally
1. Make sure you have the latest versions of npm and node installed
2. Download the .env file and place it within the server directory.
3. In a terminal window, navigate to the server folder and enter:
```
npm install
npm start
```
(npm start is configured to run nodemon on index.js for simplicity's sake)    

3. In another terminal window, navigate to the client folder and enter:
```
npm install  
npm start  
```
4. Open two browser tabs and navigate to http://localhost:3000 in each to demonstrate the live chat feature between two users

## Demo
![Demo gif](http://g.recordit.co/hrunZny1CD.gif)
In case the demo gif doesn't load, you can access it [here](http://g.recordit.co/hrunZny1CD.gif).  
Currently working on deploying this app, reach out to me at nicholasltang21@gmail.com for more info.

## To Do
- Write own gameplay logic (currently using a third-party library which only allows for single player)
- Deploy to AWS? (Need to shift from Socket.io to WebSocket API from AWS API Gateway)
