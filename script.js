// Telegram WebApp initialization
const tg = window.Telegram.WebApp;
tg.expand(); // Expand the WebApp to full view

// Game state management
let currentGame = null;
let gameActive = false;
const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// DOM Elements
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score-display');
const themeToggle = document.getElementById('theme-toggle');

// Initialize the game
function initGame(gameType) {
    try {
        currentGame = gameType;
        gameActive = true;
        
        // Clear previous game state
        gameBoard.innerHTML = '';
        if (scoreDisplay) scoreDisplay.textContent = '0';
        
        // Initialize specific game
        switch(gameType) {
            case 'chess':
                initChessGame();
                break;
            case 'ludo':
                initLudoGame();
                break;
            default:
                throw new Error('Unknown game type');
        }
        
        tg.showAlert(`🚀 ${gameType.charAt(0).toUpperCase() + gameType.slice(1)} game started!`);
    } catch (error) {
        console.error('Game initialization failed:', error);
        tg.showAlert('⚠️ Failed to start game. Please try again.');
    }
}

// Chess game implementation
function initChessGame() {
    // Create 8x8 chess board
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            square.dataset.row = row;
            square.dataset.col = col;
            gameBoard.appendChild(square);
        }
    }
}

// Ludo game implementation
function initLudoGame() {
    gameBoard.innerHTML = '<div class="ludo-container">Ludo game will appear here</div>';
}

// Score submission with validation
function submitScore(score) {
    if (!gameActive) {
        tg.showAlert('⚠️ No active game to submit score from');
        return;
    }

    if (typeof score !== 'number' || score < 0) {
        tg.showAlert('⚠️ Invalid score value');
        return;
    }

    try {
        const username = tg.initDataUnsafe?.user?.username || "Anonymous";
        const userPhoto = tg.initDataUnsafe?.user?.photo_url || null;
        
        leaderboard.push({
            username,
            score,
            game: currentGame,
            date: new Date().toISOString(),
            photo: userPhoto
        });
        
        // Keep only top 10 scores
        leaderboard.sort((a, b) => b.score - a.score);
        while (leaderboard.length > 10) leaderboard.pop();
        
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        tg.showAlert(`🎉 Score of ${score} saved to ${currentGame} leaderboard!`);
        
        updateLeaderboardDisplay();
        gameActive = false;
    } catch (error) {
        console.error('Score submission failed:', error);
        tg.showAlert('⚠️ Failed to save score. Please try again.');
    }
}

// Update leaderboard display
function updateLeaderboardDisplay() {
    const leaderboardContainer = document.getElementById('leaderboard-entries');
    if (!leaderboardContainer) return;
    
    leaderboardContainer.innerHTML = leaderboard
        .map((entry, index) => `
            <div class="leaderboard-entry">
                <span class="rank">${index + 1}.</span>
                ${entry.photo ? `<img src="${entry.photo}" class="user-avatar">` : ''}
                <span class="username">${entry.username}</span>
                <span class="score">${entry.score} pts</span>
            </div>
        `)
        .join('');
}

// Theme management
function setupThemeToggle() {
    if (!themeToggle) return;
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'bright') {
        document.body.classList.add('bright-theme');
        themeToggle.checked = true;
    }
    
    // Set up toggle event
    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('bright-theme');
        localStorage.setItem('theme', this.checked ? 'bright' : 'dark');
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    
    // Set up game buttons
    document.querySelectorAll('.game-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const gameType = this.dataset.game;
            if (gameType) initGame(gameType);
        });
    });
    
    // Set up score submission button
    const submitBtn = document.getElementById('submit-score');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const score = calculateCurrentScore(); // Implement your score calculation
            submitScore(score);
        });
    }
    
    // Initialize with first game
    initGame('chess');
});

// Error handling for WebApp API
if (!window.Telegram || !window.Telegram.WebApp) {
    console.error('Telegram WebApp API not found!');
    document.body.innerHTML = `
        <div class="error-message">
            <h2>⚠️ Telegram WebApp Required</h2>
            <p>This game must be run within the Telegram app.</p>
        </div>
    `;
    }
