
        // Game state
        let board = [];
        let previousBoard = [];
        let score = 0;
        let previousScore = 0;
        let bestScore = localStorage.getItem('bestScore') || 0;
        let moves = 0;
        let previousMoves = 0;
        let gameWon = false;
        let gameOver = false;

        // Initialize game
        function initGame() {
            board = Array(4).fill().map(() => Array(4).fill(0));
            previousBoard = [];
            score = 0;
            previousScore = 0;
            moves = 0;
            previousMoves = 0;
            gameWon = false;
            gameOver = false;
            
            // Update best score display
            document.getElementById('bestScore').textContent = bestScore;
            
            // Create board HTML
            createBoard();
            
            // Add two initial tiles
            addRandomTile();
            addRandomTile();
            
            updateDisplay();
        }

        function createBoard() {
            const gameBoard = document.getElementById('gameBoard');
            gameBoard.innerHTML = '';
            
            for (let i = 0; i < 16; i++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.id = `tile-${i}`;
                gameBoard.appendChild(tile);
            }
        }

        function addRandomTile() {
            const emptyCells = [];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (board[i][j] === 0) {
                        emptyCells.push({row: i, col: j});
                    }
                }
            }
            
            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                const value = Math.random() < 0.9 ? 2 : 4;
                board[randomCell.row][randomCell.col] = value;
            }
        }

        function updateDisplay() {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    const index = i * 4 + j;
                    const tile = document.getElementById(`tile-${index}`);
                    const value = board[i][j];
                    
                    if (value === 0) {
                        tile.textContent = '';
                        tile.className = 'tile';
                    } else {
                        tile.textContent = value;
                        tile.className = `tile tile-${value}`;
                    }
                }
            }
            
            document.getElementById('score').textContent = score;
            document.getElementById('moves').textContent = moves;
            
            // Update best score
            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('bestScore', bestScore);
                document.getElementById('bestScore').textContent = bestScore;
            }
        }

        function saveState() {
            previousBoard = board.map(row => [...row]);
            previousScore = score;
            previousMoves = moves;
        }

        function moveLeft() {
            saveState();
            let moved = false;
            let newScore = 0;
            
            for (let i = 0; i < 4; i++) {
                const row = board[i].filter(val => val !== 0);
                for (let j = 0; j < row.length - 1; j++) {
                    if (row[j] === row[j + 1]) {
                        row[j] *= 2;
                        newScore += row[j];
                        row[j + 1] = 0;
                        j++;
                    }
                }
                const newRow = row.filter(val => val !== 0);
                while (newRow.length < 4) {
                    newRow.push(0);
                }
                
                for (let j = 0; j < 4; j++) {
                    if (board[i][j] !== newRow[j]) {
                        moved = true;
                    }
                }
                board[i] = newRow;
            }
            
            if (moved) {
                score += newScore;
                moves++;
                addRandomTile();
                updateDisplay();
                checkGameState();
            }
        }

        function moveRight() {
            saveState();
            let moved = false;
            let newScore = 0;
            
            for (let i = 0; i < 4; i++) {
                const row = board[i].filter(val => val !== 0);
                for (let j = row.length - 1; j > 0; j--) {
                    if (row[j] === row[j - 1]) {
                        row[j] *= 2;
                        newScore += row[j];
                        row[j - 1] = 0;
                        j--;
                    }
                }
                const newRow = row.filter(val => val !== 0);
                while (newRow.length < 4) {
                    newRow.unshift(0);
                }
                
                for (let j = 0; j < 4; j++) {
                    if (board[i][j] !== newRow[j]) {
                        moved = true;
                    }
                }
                board[i] = newRow;
            }
            
            if (moved) {
                score += newScore;
                moves++;
                addRandomTile();
                updateDisplay();
                checkGameState();
            }
        }

        function moveUp() {
            saveState();
            let moved = false;
            let newScore = 0;
            
            for (let j = 0; j < 4; j++) {
                const column = [];
                for (let i = 0; i < 4; i++) {
                    if (board[i][j] !== 0) {
                        column.push(board[i][j]);
                    }
                }
                
                for (let i = 0; i < column.length - 1; i++) {
                    if (column[i] === column[i + 1]) {
                        column[i] *= 2;
                        newScore += column[i];
                        column[i + 1] = 0;
                        i++;
                    }
                }
                
                const newColumn = column.filter(val => val !== 0);
                while (newColumn.length < 4) {
                    newColumn.push(0);
                }
                
                for (let i = 0; i < 4; i++) {
                    if (board[i][j] !== newColumn[i]) {
                        moved = true;
                    }
                    board[i][j] = newColumn[i];
                }
            }
            
            if (moved) {
                score += newScore;
                moves++;
                addRandomTile();
                updateDisplay();
                checkGameState();
            }
        }

        function moveDown() {
            saveState();
            let moved = false;
            let newScore = 0;
            
            for (let j = 0; j < 4; j++) {
                const column = [];
                for (let i = 0; i < 4; i++) {
                    if (board[i][j] !== 0) {
                        column.push(board[i][j]);
                    }
                }
                
                for (let i = column.length - 1; i > 0; i--) {
                    if (column[i] === column[i - 1]) {
                        column[i] *= 2;
                        newScore += column[i];
                        column[i - 1] = 0;
                        i--;
                    }
                }
                
                const newColumn = column.filter(val => val !== 0);
                while (newColumn.length < 4) {
                    newColumn.unshift(0);
                }
                
                for (let i = 0; i < 4; i++) {
                    if (board[i][j] !== newColumn[i]) {
                        moved = true;
                    }
                    board[i][j] = newColumn[i];
                }
            }
            
            if (moved) {
                score += newScore;
                moves++;
                addRandomTile();
                updateDisplay();
                checkGameState();
            }
        }

        function checkGameState() {
            // Check for 2048
            if (!gameWon) {
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (board[i][j] === 2048) {
                            gameWon = true;
                            showSuccess();
                            return;
                        }
                    }
                }
            }
            
            // Check for game over
            if (isGameOver()) {
                gameOver = true;
                showGameOver();
            }
        }

        function isGameOver() {
            // Check for empty cells
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (board[i][j] === 0) {
                        return false;
                    }
                }
            }
            
            // Check for possible merges
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (j < 3 && board[i][j] === board[i][j + 1]) {
                        return false;
                    }
                    if (i < 3 && board[i][j] === board[i + 1][j]) {
                        return false;
                    }
                }
            }
            
            return true;
        }

        function showSuccess() {
            document.getElementById('finalScore').textContent = score;
            document.getElementById('finalMoves').textContent = moves;
            document.getElementById('overlay').classList.add('show');
            document.getElementById('successMessage').classList.add('show');
        }

        function closeSuccess() {
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('successMessage').classList.remove('show');
        }

function showGameOver() {
    const loseSound = new Audio('assets/lose.mp3');
    loseSound.currentTime = 0; // Đảm bảo phát từ đầu
    loseSound.play().catch(() => {
        // Nếu trình duyệt chặn tự động phát, có thể xử lý ở đây
    });
    document.getElementById('gameOverScore').textContent = score;
    document.getElementById('gameOverMoves').textContent = moves;
    document.getElementById('overlay').classList.add('show');
    document.getElementById('gameOverMessage').classList.add('show');
}




        function closeGameOver() {
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('gameOverMessage').classList.remove('show');
        }

        function undoMove() {
            if (previousBoard.length > 0) {
                board = previousBoard.map(row => [...row]);
                score = previousScore;
                moves = previousMoves;
                updateDisplay();
                previousBoard = [];
                gameOver = false;
            }
        }

        function newGame() {
            initGame();
        }

        function resetGame() {
            if (confirm('Bạn có chắc muốn đặt lại game?')) {
                initGame();
            }
        }

        function showInstructions() {
            alert('🎮 Hướng dẫn chơi 2048:\n\n' +
                  '• Sử dụng phím mũi tên để di chuyển các ô\n' +
                  '• Khi hai ô có cùng số chạm nhau, chúng sẽ hợp nhất\n' +
                  '• Mục tiêu: Tạo ra ô 2048!\n' +
                  '• Trên mobile: vuốt để di chuyển\n' +
                  '• Sử dụng nút "Hoàn tác" để quay lại nước đi trước');
        }

        // Event listeners
        document.addEventListener('keydown', (e) => {
            if (gameOver) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    moveLeft();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    moveRight();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    moveUp();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    moveDown();
                    break;
            }
        });

        // Touch support
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });

        document.addEventListener('touchend', (e) => {
            if (gameOver) return;
            
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 50) {
                    moveLeft();
                } else if (diffX < -50) {
                    moveRight();
                }
            } else {
                if (diffY > 50) {
                    moveUp();
                } else if (diffY < -50) {
                    moveDown();
                }
            }
        });

        // Initialize game when page loads
        window.onload = function() {
            initGame();
        };
    