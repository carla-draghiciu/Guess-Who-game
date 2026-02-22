const socket = io();


document.querySelector('.create-button').addEventListener('click', () => {
  socket.emit('createGame');
});


// socket.on('gameCreated', (code) => {
//   console.log('Game created with code:', code);
//   localStorage.setItem('game_code', code);
//   goTo('create-screen');
// });

function goTo(screen) {
  document.querySelectorAll('.screen').forEach(s => {
    s.style.display = 'none';
  });
  document.getElementById(screen).style.display = 'block';
}


document.querySelector('.join-button').addEventListener('click', () => {
  goTo('join-screen');
});
