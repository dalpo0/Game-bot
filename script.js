// Telegram WebApp initialization
const tg = window.Telegram.WebApp;
tg.expand();

// Game state
let currentGame = null;
let gameActive = false;
let currentScore = 0;
const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Initialize games
function initChess() {
  currentGame = 'chess';
  currentScore = 0;
  document.getElementById('chess-score').textContent = '0';
  
  // Simple chess piece movement demo
  document.querySelectorAll('.chess-square').forEach(square => {
    square.onclick = () => {
      if (gameActive && currentGame === 'chess') {
        square.innerHTML = square.innerHTML ? '' : '♟';
        currentScore += 10;
        document.getElementById('chess-score').textContent = currentScore;
      }
    };
  });
}

function initLudo() {
  currentGame = 'ludo';
  currentScore = 0;
  document.getElementById('ludo-score').textContent = '0';
  
  // Simple dice roll demo
  document.getElementById('roll-dice').onclick = () => {
    if (gameActive && currentGame === 'ludo') {
      const roll = Math.floor(Math.random() * 6) + 1;
      currentScore += roll * 5;
      document.getElementById('ludo-score').textContent = currentScore;
      tg.showAlert(`🎲 You rolled a ${roll}!`);
    }
  };
}

// Button handlers
document.getElementById('start-chess').onclick = () => {
  gameActive = true;
  tg.showAlert("♟ Chess game started! Click squares to place pieces.");
};

document.getElementById('submit-chess').onclick = () => {
  if (gameActive) {
    submitScore('chess', currentScore);
    gameActive = false;
  }
};

document.getElementById('submit-ludo').onclick = () => {
  if (gameActive) {
    submitScore('ludo', currentScore);
    gameActive = false;
  }
};

// Leaderboard functions
function submitScore(game, score) {
  leaderboard.push({
    username: tg.initDataUnsafe?.user?.username || "Player",
    score,
    game,
    date: new Date().toISOString()
  });
  
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  tg.showAlert(`🏆 ${score} points saved to ${game} leaderboard!`);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initChess();
  initLudo();
});
