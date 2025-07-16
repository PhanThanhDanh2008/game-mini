
        // Game state
        let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'x';
        let gameActive = true;
        let difficulty = 'easy'; // easy, medium, hard
        let scores = {
            x: 0,
            o: 0,
            draw: 0
        };

        // DOM elements
        const gameBoard = document.getElementById('gameBoard');
        const gameStatus = document.getElementById('gameStatus');
        const resetBtn = document.getElementById('resetBtn');
        const cells = document.querySelectorAll('.cell');
        const scoreX = document.getElementById('scoreX');
        const scoreO = document.getElementById('scoreO');
        const scoreDraw = document.getElementById('scoreDraw');
        const difficultySpan = document.getElementById('difficulty');

        // Winning combinations
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        // Initialize game
        function initGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'x';
            gameActive = true;
            gameStatus.textContent = '❌ Lượt của bạn';
            gameStatus.className = 'game-status x-turn';
            
            cells.forEach(cell => {
                cell.textContent = '';
                cell.className = 'cell';
            });
        }

        // Handle cell click
        function handleCellClick(index) {
            if (board[index] !== '' || !gameActive || currentPlayer !== 'x') return;

            board[index] = currentPlayer;
            cells[index].textContent = currentPlayer === 'x' ? '❌' : '⭕';
            cells[index].classList.add(currentPlayer);

            if (checkWin()) {
                endGame(currentPlayer);
                return;
            }

            if (board.every(cell => cell !== '')) {
                endGame('draw');
                return;
            }

            currentPlayer = 'o';
            gameStatus.textContent = '⭕ Lượt máy tính...';
            gameStatus.className = 'game-status o-turn';
            
            // AI move with delay
            setTimeout(() => {
                makeAIMove();
            }, 500);
        }

        // AI move logic
        function makeAIMove() {
            let move;
            
            if (difficulty === 'easy') {
                move = getRandomMove();
            } else if (difficulty === 'medium') {
                move = Math.random() < 0.7 ? getBestMove() : getRandomMove();
            } else {
                move = getBestMove();
            }

            if (move !== -1) {
                board[move] = 'o';
                cells[move].textContent = '⭕';
                cells[move].classList.add('o');

                if (checkWin()) {
                    endGame('o');
                    return;
                }

                if (board.every(cell => cell !== '')) {
                    endGame('draw');
                    return;
                }

                currentPlayer = 'x';
                gameStatus.textContent = '❌ Lượt của bạn';
                gameStatus.className = 'game-status x-turn';
            }
        }

        // Get random available move
        function getRandomMove() {
            const availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
            return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : -1;
        }

        // Get best move using minimax
        function getBestMove() {
            // Check if AI can win
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'o';
                    if (checkWin()) {
                        board[i] = '';
                        return i;
                    }
                    board[i] = '';
                }
            }

            // Check if AI needs to block player
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'x';
                    if (checkWin()) {
                        board[i] = '';
                        return i;
                    }
                    board[i] = '';
                }
            }

            // Take center if available
            if (board[4] === '') return 4;

            // Take corners
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(corner => board[corner] === '');
            if (availableCorners.length > 0) {
                return availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }

            // Take any available move
            return getRandomMove();
        }

        // Check for win
        function checkWin() {
            return winConditions.some(condition => {
                const [a, b, c] = condition;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    // Highlight winning cells
                    cells[a].classList.add('winning');
                    cells[b].classList.add('winning');
                    cells[c].classList.add('winning');
                    return true;
                }
                return false;
            });
        }

        // End game
        function endGame(winner) {
            gameActive = false;
            cells.forEach(cell => cell.classList.add('disabled'));

            if (winner === 'draw') {
                gameStatus.textContent = '🤝 Hoà rồi!';
                gameStatus.className = 'game-status draw';
                scores.draw++;
                scoreDraw.textContent = scores.draw;
            } else if (winner === 'x') {
                gameStatus.textContent = '🎉 Bạn thắng rồi!';
                gameStatus.className = 'game-status win';
        if (winner === 'x') {
            const winSound = new Audio('assets/win.mp3');
            winSound.play();
        } else {
            const loseSound = new Audio('assets/lose.mp3');
            loseSound.play();
        }
                scores.x++;
                scoreX.textContent = scores.x;
            } else {
                gameStatus.textContent = '😔 Máy tính thắng!';
                gameStatus.className = 'game-status win';
        if (winner === 'x') {
            const winSound = new Audio('assets/win.mp3');
            winSound.play();
        } else {
            const loseSound = new Audio('assets/lose.mp3');
            loseSound.play();
        }
                scores.o++;
                scoreO.textContent = scores.o;
            }
        }

        // Toggle difficulty
        function toggleDifficulty() {
            const difficulties = ['easy', 'medium', 'hard'];
            const names = ['Dễ', 'Trung bình', 'Khó'];
            const currentIndex = difficulties.indexOf(difficulty);
            const nextIndex = (currentIndex + 1) % difficulties.length;
            difficulty = difficulties[nextIndex];
            difficultySpan.textContent = names[nextIndex];
        }

        // Event listeners
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => handleCellClick(index));
        });

        resetBtn.addEventListener('click', initGame);

        // Initialize game on load
        initGame();

        // Add some sound effects (placeholder)
        function playSound(type) {
            // Placeholder for sound effects
            // You can add actual audio here
        }
    