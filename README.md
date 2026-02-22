# Guess Who? - Multiplayer Web Game
## Game Overview
This is real-time multiplayer "Guess Who" game built with HTML, CSS, JavaScript, Node.js and Socket.io.
Players can create or join a game room using a code, customize the game board, chat with eachother and play the classic elimination game in real time.

## Features
* Create or join a game using a random generated unique game code
* Real-time multiplayer (2 players)
* Live chat system (Socket.io)
* Interactive customizable game grid
* Modular frontend structure

## Screenshots
### Main page
<img width="959" height="413" alt="image" src="https://github.com/user-attachments/assets/c83c15b9-e80b-4a96-b3d3-71f3a7b514b5" />

### Create game page
The creator can customize the board to their liking.
<img width="959" height="410" alt="image" src="https://github.com/user-attachments/assets/7bc8d653-8496-403e-8a82-cf96cf702756" />

### Join game page
The player must enter the correct code and a name to be able to play the game.
<img width="959" height="413" alt="image" src="https://github.com/user-attachments/assets/05db0686-2b55-4fe2-b7d7-9be6867bd510" />

### Customizable game board
Once the second player clicks "Join" and the code is valid, the creator may see who joined. All changes made to the board will be saved and once the game starts both players will have the new board.
<img width="959" height="413" alt="image" src="https://github.com/user-attachments/assets/9ef35723-f10a-412d-9eeb-26293aa686f1" />

### Game page
Each player will randomly get a character that the other person must guess.
<img width="959" height="413" alt="image" src="https://github.com/user-attachments/assets/931a3d88-ce84-4914-8809-0c2bec4f00c6" />
<img width="959" height="414" alt="image" src="https://github.com/user-attachments/assets/9fe9343d-12e6-4572-a6cf-ea2594545f23" />

### Real-time communication
By taking turns, each player may ask questions about each other's character and try to guess them by flipping over the characters which do not match the answer.
<img width="959" height="413" alt="image" src="https://github.com/user-attachments/assets/dd99ea6a-c7ee-4831-9d89-78664edd3239" />
<img width="959" height="413" alt="image" src="https://github.com/user-attachments/assets/c5e36bd3-2525-43c2-96cb-cadcf9e09a60" />

## What I learnt
* structuring frontend code into modules
* how to manage real-time communication using Socket.io
* managing rooms and socket IDs
* connecting frontend and backend logic

## Future improvements
* handling disconnections
* handling rejoins for disconnected players
* authentication system
* mobile responsive design
* database management
* cuter design
