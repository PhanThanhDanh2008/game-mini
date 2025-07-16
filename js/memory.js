// Game state
        let gameState = {
            isPlaying: false,
            difficulty: 'medium',
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            totalPairs: 0,
            moves: 0,
            score: 0,
            startTime: null,
            timer: null
        };

        // Game configurations
        const gameConfigs = {
            easy: { rows: 2, cols: 3, pairs: 3 },
            medium: { rows: 3, cols: 4, pairs: 6 },
            hard: { rows: 4, cols: 5, pairs: 10 }
        };

        // Card symbols
        const cardSymbols = [
            '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
            '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
            '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋'
        ];

        // Initialize game
        function initGame() {
            loadHighScore();
            updateDisplay();
        }

        // Load high score from localStorage
        function loadHighScore() {
            const saved = localStorage.getItem(`memoryGame_highScore_${gameState.difficulty}`);
            if (saved) {
                document.getElementById('highScore').textContent = saved;
            }
        }

        // Save high score
        function saveHighScore(score) {
            const current = parseInt(document.getElementById('highScore').textContent);
            if (score > current) {
                localStorage.setItem(`memoryGame_highScore_${gameState.difficulty}`, score);
                document.getElementById('highScore').textContent = score;
                return true;
            }
            return false;
        }

        // Change difficulty
        function changeDifficulty() {
            gameState.difficulty = document.getElementById('difficulty').value;
            const cardsGrid = document.getElementById('cardsGrid');
            cardsGrid.className = `cards-grid ${gameState.difficulty}`;
            loadHighScore();
            if (gameState.isPlaying) {
                resetGame();
            }
        }

        // Start game
        function startGame() {
            gameState.isPlaying = true;
            gameState.moves = 0;
            gameState.score = 0;
            gameState.matchedPairs = 0;
            gameState.flippedCards = [];
            gameState.startTime = Date.now();
            
            createCards();
            startTimer();
            updateDisplay();
            updateGameStatus('playing', '🎮 Tìm các cặp thẻ giống nhau!');
            
            document.getElementById('startBtn').disabled = true;
        }

        // Reset game
        function resetGame() {
            gameState.isPlaying = false;
            gameState.moves = 0;
            gameState.score = 0;
            gameState.matchedPairs = 0;
            gameState.flippedCards = [];
            
            if (gameState.timer) {
                clearInterval(gameState.timer);
                gameState.timer = null;
            }
            
            document.getElementById('cardsGrid').innerHTML = '';
            document.getElementById('startBtn').disabled = false;
            updateDisplay();
            updateGameStatus('playing', '🎮 Nhấn "Bắt đầu" để chơi');
        }

        // Create cards
        function createCards() {
            const config = gameConfigs[gameState.difficulty];
            const totalCards = config.rows * config.cols;
            gameState.totalPairs = totalCards / 2;
            
            // Get random symbols
            const symbols = cardSymbols.slice(0, gameState.totalPairs);
            const cardData = [...symbols, ...symbols];
            
            // Shuffle cards
            for (let i = cardData.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cardData[i], cardData[j]] = [cardData[j], cardData[i]];
            }
            
            // Create card elements
            const cardsGrid = document.getElementById('cardsGrid');
            cardsGrid.innerHTML = '';
            
            cardData.forEach((symbol, index) => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.dataset.symbol = symbol;
                card.dataset.index = index;
                card.onclick = () => flipCard(card);
                
                card.innerHTML = `
                    <div class="card-front">🧠</div>
                    <div class="card-back">${symbol}</div>
                `;
                
                cardsGrid.appendChild(card);
            });
        }

        // Flip card
        function flipCard(card) {
            if (!gameState.isPlaying || card.classList.contains('flipped') || 
                card.classList.contains('matched') || gameState.flippedCards.length >= 2) {
                return;
            }
            
            card.classList.add('flipped');
            gameState.flippedCards.push(card);
            
            if (gameState.flippedCards.length === 2) {
                gameState.moves++;
                updateDisplay();
                
                setTimeout(() => {
                    checkMatch();
                }, 1000);
            }
        }

        // Check if cards match
        function checkMatch() {
            const [card1, card2] = gameState.flippedCards;
            
            if (card1.dataset.symbol === card2.dataset.symbol) {
                // Match found
                card1.classList.add('matched');
                card2.classList.add('matched');
                gameState.matchedPairs++;
                
                // Calculate score bonus
                gameState.score += Math.max(100 - gameState.moves * 2, 10);
                
                // Check if game is won
                if (gameState.matchedPairs === gameState.totalPairs) {
                    gameWon();
                }
            } else {
                // No match
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }
            
            gameState.flippedCards = [];
            updateDisplay();
        }

        // Game won
        function gameWon() {
            gameState.isPlaying = false;
            if (gameState.timer) {
                clearInterval(gameState.timer);
                gameState.timer = null;
            }
            
            // Calculate final score
            const timeBonus = Math.max(1000 - Math.floor((Date.now() - gameState.startTime) / 1000) * 10, 0);
            const moveBonus = Math.max(500 - gameState.moves * 5, 0);
            gameState.score += timeBonus + moveBonus;
            
            updateDisplay();
            updateGameStatus('won', '🎉 Chúc mừng! Bạn đã hoàn thành!');
            
            // Show win message
            const isNewRecord = saveHighScore(gameState.score);
            showGameWin(isNewRecord);
            
            document.getElementById('startBtn').disabled = false;
        }

        // Start timer
        function startTimer() {
            gameState.timer = setInterval(() => {
                if (gameState.isPlaying) {
                    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
                    const minutes = Math.floor(elapsed / 60);
                    const seconds = elapsed % 60;
                    document.getElementById('time').textContent = 
                        `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
            }, 1000);
        }

        // Update display
        function updateDisplay() {
            document.getElementById('score').textContent = gameState.score;
            document.getElementById('moves').textContent = gameState.moves;
        }

        // Update game status
        function updateGameStatus(type, message) {
            const status = document.getElementById('gameStatus');
            status.className = `game-status ${type}`;
            status.textContent = message;
        }

        // Show game win message
        function showGameWin(isNewRecord) {
            const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            document.getElementById('finalScore').textContent = gameState.score;
            document.getElementById('finalMoves').textContent = gameState.moves;
            document.getElementById('finalTime').textContent = timeString;
            document.getElementById('newRecord').style.display = isNewRecord ? 'block' : 'none';
            
            document.getElementById('overlay').classList.add('show');
            document.getElementById('gameWinMessage').classList.add('show');
        }

        // Close game win message
        function closeGameWin() {
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('gameWinMessage').classList.remove('show');
        }

        // Show instructions
        function showInstructions() {
            alert('🎮 Cách chơi Memory Game:\n\n' +
                  '• Nhấn "Bắt đầu" để bắt đầu game\n' +
                  '• Nhấn vào thẻ để lật và xem hình ảnh\n' +
                  '• Tìm các cặp thẻ có hình ảnh giống nhau\n' +
                  '• Hoàn thành game với ít lượt chơi nhất\n' +
                  '• Thời gian chơi càng ít thì điểm số càng cao\n\n' +
                  'Chúc bạn chơi vui vẻ!');
        }

        // Initialize game on page load
        document.addEventListener('DOMContentLoaded', initGame);