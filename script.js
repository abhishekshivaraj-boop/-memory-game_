const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let canFlip = true;

const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const winScreen = document.getElementById('winScreen');

function startGame() {
  // Reset everything
  cards = [...emojis, ...emojis];
  shuffle(cards);
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  timer = 0;
  canFlip = true;

  movesEl.textContent = moves;
  timeEl.textContent = timer;
  winScreen.style.display = 'none';

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    timeEl.textContent = timer;
  }, 1000);

  // Create cards
  board.innerHTML = '';
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    card.dataset.emoji = emoji;

    card.innerHTML = `
      <div class="card-face card-front">?</div>
      <div class="card-face card-back">${emoji}</div>
    `;

    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function flipCard(card) {
  if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
    return;
  }

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    canFlip = false;
    moves++;
    movesEl.textContent = moves;

    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
      // Match found
      setTimeout(() => {
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        canFlip = true;
        matchedPairs++;

        if (matchedPairs === emojis.length) {
          clearInterval(timerInterval);
          document.getElementById('finalMoves').textContent = moves;
          document.getElementById('finalTime').textContent = timer;
          winScreen.style.display = 'flex';
        }
      }, 400);
    } else {
      // No match
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
        canFlip = true;
      }, 900);
    }
  }
}

// Start the game when page loads
startGame();