import { state } from './cards.js';
export function addCardsToGame() {
  const game_grid = document.querySelector('.game-grid');
  let code = '';
  for (let i = 0; i < 24; i++) {
    const char_name = state.cards[i].name;
    const char_img = state.cards[i].img;
    const card_div = `
    <div class="game-card" data-index="${i}"> 
    <button class="game-character">
      <img class="game-character-image" src="${char_img}">
    </button>
    <input class="game-file-input" type="file" id="fileInput" style="display: none;"> 
    <input class="game-name-input" value="${char_name}" readonly> 
    </div> `;
    code += card_div;
  }
  game_grid.innerHTML = code;
}

export function turnImages() {
  let turned = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  const imgs = document.querySelectorAll('.game-card');
  imgs.forEach((card, index) => {
    const img = card.querySelector('.game-character');
    const inp = card.querySelector('.game-name-input');
    img.addEventListener('click', () => {
      console.log('Clicked on card', index);
      if (!turned[index]) {
        inp.style.display = 'none';
        img.innerHTML = '?';
        img.style.backgroundColor = '#FF8040';
        img.style.color = '#060771';
        img.style.fontSize = '40px';
        img.style.fontWeight = 'bold';
        img.style.border = '3px solid #060771';
        img.style.height = '104px';
        turned[index] = true;
      } else {
        let char_img = state.cards[index].img;
        inp.style.display = 'block';
        img.innerHTML = `<img class="game-character-image" src="${char_img}"></img>`;
        img.style.border = 'none';
        img.style.height = '80px';
        turned[index] = false;
      }
    });
  });
}

// export function turnImages() {
//   let turned = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
//   const imgs = document.querySelectorAll('.game-character');
//   imgs.forEach((img, index) => {
//     img.addEventListener('click', () => {
//       console.log('Clicked on card', index);
//       if (!turned[index]) {
//         img.innerHTML = '?';
//         img.style.backgroundColor = '#FF8040';
//         img.style.color = '#060771';
//         img.style.fontSize = '40px';
//         img.style.fontWeight = 'bold';
//         img.style.border = '3px solid #060771';
//         img.style.height = '100px';
//         turned[index] = true;
//       } else {
//         let char_img = state.cards[index].img;
//         img.innerHTML = `<img class="game-character-image" src="${char_img}"></img>`;
//         img.style.border = 'none';
//         img.style.height = '80px';
//         turned[index] = false;
//       }
//     });
//   });
// }



export function randomCard() {
  const randomIndex = Math.floor(Math.random() * state.cards.length);
  console.log(randomIndex);

  const card = state.cards[randomIndex];
  const code = `
  <p class="chosen-card-title">Your character:</p>
  <button class="character2">
  <img class="character-image2" src="${card.img}">
  </button>
  <input class="file-input" type="file" id="fileInput" style="display: none;">
  <input class="name-input2" value="${card.name}" readonly>
  `;
  document.querySelector('.chosen-card').innerHTML = code;
}

const sendButton = document.querySelector('.send-button');
const chatInput = document.querySelector('.chat-input');
// console.log('sendButton:', sendButton);
sendButton.addEventListener('click', () => {
  const message = chatInput.value.trim();
  if (message !== '') {
    console.log('Sending message:', message);
    const game_code = localStorage.getItem('game_code');
    console.log('Game code for chat message:', game_code);
    socket.emit('chatMessage', { message, game_code });
    chatInput.value = '';
  }
});


// randomCard();



const chatBox = document.querySelector('.chat-messages');
socket.on('chatMessage', ({ message, senderId }) => {
  console.log('Received message:', message, 'from', senderId);
  const div = document.createElement('div');
  div.classList.add('chat-message');
  div.classList.add(senderId === socket.id ? 'self' : 'other');
  div.innerHTML = `${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight; // auto scroll
});

socket.on('gameStarted', ({ host_id, host_name, player_id, player_name }) => {
  const chat_header = document.querySelector('.chat-header');
  if (socket.id === host_id) {
    chat_header.innerHTML = `${player_name}`;
  } else if (socket.id === player_id) {
    chat_header.innerHTML = `${host_name}`;
  }
});