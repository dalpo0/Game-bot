// Load TensorFlow model for predictions
async function loadAIModel() {
    const model = await tf.loadLayersModel('/assets/models/leaderboard.json');
    return model;
}

// Generate emoji reaction
function getAIEmoji(event) {
    fetch('/assets/emojis/reactions.json')
        .then(response => response.json())
        .then(emojis => {
            const reaction = emojis[event.type] || ['✨'];
            document.getElementById('ai-reaction').textContent = reaction[0];
        });
}

// Init
document.querySelectorAll('.game-btn').forEach(btn => {
    btn.addEventListener('mouseover', () => getAIEmoji({type: 'hover'}));
});
