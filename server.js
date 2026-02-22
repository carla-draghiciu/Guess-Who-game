import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public')); // folder with HTML, scripts, styles


const games = {}; // { GAMECODE: { creatorId: { string, players: [ { playerId: string, playerName: string } ] } }

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);


  socket.on('createGame', () => {
    const gameCode = Math.random().toString(36).substr(2, 6).toUpperCase();

    games[gameCode] = {
      creator: { creatorId: socket.id, name: 'Host' },
      players: [],
    };

    socket.join(gameCode);
    socket.emit('gameCreated', gameCode);
    console.log(`Game created with code ${gameCode}`);
    console.log(games);
  });


  socket.on('joinGame', ({ code, name }) => {
    const game = games[code];

    if (game) {
      if (game.players.length == 1) {
        socket.emit('errorMessage', 'Game is full!');
        return;
      }
      socket.join(code);
      game.players.push({ id: socket.id, name: name });
      socket.emit('joinSuccess', code);
      io.to(game.creator.creatorId).emit('playerJoined', { name }); // notify creator only
      console.log(`${name} joined game ${code}`);
      console.log(games);
    } else {
      socket.emit('errorMessage', 'Game not found!');
    }
  });


  // socket.on('rejoinGame', (code) => {
  //   // const game = games[code];
  //   games[code] = {
  //     creator: { creatorId: socket.id, name: 'Host' },
  //     players: [],
  //   };
  //   const game = games[code];
  //   if (game) {
  //     socket.join(code);
  //     game.creator.creatorId = socket.id; // update to new socket id
  //     console.log(`Creator rejoined game ${code}`);
  //     if (game.players.length > 0) {
  //       game.players.forEach((player) => {
  //         const name = player.name;
  //         io.to(game.creator.creatorId).emit('playerJoined', { name });
  //       });
  //     }
  //     console.log(games);
  //   } else {
  //     console.log(`Rejoin failed — game ${code} not found`);
  //   }
  // });


  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    for (const [game_code, game_data] of Object.entries(games)) {
      if (!game_data || !game_data.creator) continue;
      if (game_data.creator.creatorId == socket.id) {
        delete games[game_code];
        break;
      }

      game_data.players.forEach((player, index) => {
        if (socket.id === player.id) {
          const p_name = player.name;

          if (game_data.creator && game_data.creator.creatorId) {
            io.to(game_data.creator.creatorId).emit('playerDisconnected', { p_name });
          }

          game_data.players.splice(index, 1);

          console.log(`${p_name} left game ${game_code}`);
        }
      });
    }
  });

  socket.on('startingGame', ({ game_code, host_name, cards, validStart }) => {
    const game = games[game_code];
    game.cards = cards;

    if (game.creator && game.creator.creatorId === socket.id) {
      if (game.players.length < 1) {
        socket.emit('errorMessage', 'Need 1 player to start the game!');
        validStart = false;
        return;
      }
      console.log(`Game ${game_code} is starting!`);
      console.log(games);
      game.creator.name = host_name;
      io.to(game_code).emit('startingGame', {cards});
      const host_id = game.creator.creatorId;
      const player_id = game.players[0].id;
      const player_name = game.players[0].name;
      io.to(game_code).emit('gameStarted', { host_id, host_name, player_id, player_name });
    }
  });

  socket.on('chatMessage', ({ message, game_code }) => {
    console.log(`Message from ${socket.id}: ${message}`);
    console.log(`Game code: ${game_code}`);
    console.log(games);
    if (!message || !game_code) return;

    const game_data = games[game_code];
    if (!game_data) return;

    console.log(`Broadcasting message to game ${game_code}`);
    io.to(game_code).emit('chatMessage', {
      message,
      senderId: socket.id
    });
  });


});

server.listen(3000, '0.0.0.0', () =>
  console.log('Server running on http://localhost:3000')
);
