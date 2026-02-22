import { state } from './cards.js';
import { addCardsToGame, turnImages, randomCard } from './game.js';

function getCode() {
  const game_code = localStorage.getItem('game_code');
  document.querySelector('.game-code').textContent = `Game code: ${game_code}`;
}

socket.on('gameCreated', (code) => {
  console.log('Game created with code:', code);
  localStorage.setItem('game_code', code);
  goTo('create-screen');
  getCode();
});

const grid = document.querySelector('.game-create-grid');
function addCards() {
  let code = '';
  for (let i = 0; i < 24; i++) {
    const char_name = state.cards[i].name;
    const char_img = state.cards[i].img;
    const card_div = `
    <div class="create-card" data-index="${i}">
    <img class="create-character-image" src="${char_img}">
    <input class="create-file-input" type="file" id="fileInput" style="display: none;">
    <input class="create-name-input" value="${char_name}">
    </div> `;
    code += card_div;
  }
  grid.innerHTML = code;
}
addCards();

grid.addEventListener('click', (e) => {
  if (!e.target.classList.contains('create-character-image')) {
    return;
  }
  const card = e.target.closest('.create-card');
  const card_index = card.dataset.index;
  const img = card.querySelector('.create-character-image');
  const file = card.querySelector('.create-file-input');

  file.click();
  file.onchange = () => {
    const f = file.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
        state.cards[card_index].img = e.target.result;
      };
      reader.readAsDataURL(f);
    }
  };
});

grid.addEventListener('input', (e) => {
  if (!e.target.classList.contains('create-name-input')) {
    return;
  }
  const card = e.target.closest('.create-card');
  const card_index = card.dataset.index;
  state.cards[card_index].name = e.target.value;
});

const inputs = document.querySelectorAll('.create-name-input');
inputs.forEach(input => {
  input.addEventListener('keydown', (event) => {
    if (event.keyCode == 13) {
      input.blur();
    }
  });
});

document.querySelector('.start-button').addEventListener('click', () => {
  const game_code = localStorage.getItem('game_code');
  const host_name = document.querySelector('.player-name').value.trim();
  let validStart = true;
  socket.emit('startingGame', { game_code, host_name, cards: state.cards, validStart });
  console.log('Valid start:', validStart);
  if (!validStart) return;
  console.log(state.cards);
  goTo('game-screen');
  addCardsToGame();
  turnImages();
  randomCard();
});




// creater rejoins
// socket.on('connect', () => {
//   if (game_code) {
//     socket.emit('rejoinGame', game_code);
//     console.log('Rejoining game with code:', game_code);
//   }
// });


socket.on('playerJoined', ({ name }) => {
  console.log(`${name} joined your game!`);
  const div = document.querySelector('.players-joined');
  let paragraph = `
    <p class="joiner">${name} joined</p>
  `;
  div.innerHTML += paragraph;
  div.scrollTop = div.scrollHeight;
});


socket.on('playerDisconnected', ({ p_name }) => {
  const div = document.querySelector('.players-joined');
  let paragraph = `
    <p class="joiner">${p_name} left</p>
  `;
  div.innerHTML += paragraph;
  div.scrollTop = div.scrollHeight;
});
