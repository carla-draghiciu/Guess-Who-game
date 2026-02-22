import { state } from './cards.js';
import { addCardsToGame, turnImages, randomCard } from './game.js';

document.querySelector('.confirm-join-button').addEventListener('click', () => {
  const code = document.querySelector('.code-input').value.trim().toUpperCase();
  const name = document.querySelector('.name-input').value.trim();

  socket.emit('joinGame', { code, name });
  console.log('Joining with', code, name);
});

socket.off('joinSuccess'); // remove previous listeners to avoid duplicates
socket.on('joinSuccess', (code) => {
  localStorage.setItem('game_code', code);
  alert(`Joined game ${code}! Wait for the boss to start.`);
});

socket.on('errorMessage', (msg) => {
  alert(`${msg}`);
});

socket.on('startingGame', ({cards}) => {
  state.cards = cards;
  goTo('game-screen');
  addCardsToGame();
  turnImages();
  randomCard();
});