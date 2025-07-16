
    // Game variables
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [
        {x: 10, y: 10}
    ];
    let food = {};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameRunning = false;
    let gamePaused = false;
    let gameLoop;
    let gameSpeed = 150;
    let gameStarted = false; // Thêm biến để theo dõi trạng thái bắt đầu

    // Difficulty settings
    const difficulties = {
        easy: 200,
        medium: 150,
        hard: 100,
        expert: 70
    };

    // Initialize game
    function initGame() {
        document.getElementById('highScore').textContent = highScore;
        generateFood();
        updateDisplay();
        drawGame();
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };

        // Make sure food doesn't spawn on snake
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                generateFood();
                return;
            }
        }
    }

    function drawGame() {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = '#52c41a';
        for (let segment of snake) {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        }

        // Draw snake head differently
        if (snake.length > 0) {
            ctx.fillStyle = '#389e0d';
            ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 2, gridSize - 2);
        }

        // Draw food
        ctx.fillStyle = '#ff4d4f';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

        // Draw grid lines
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (let i = 0; i <= tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
    }

    function updateGame() {
        if (!gameRunning || gamePaused) return;

        // Chỉ di chuyển khi đã có hướng di chuyển
        if (dx === 0 && dy === 0) return;

        const head = {x: snake[0].x + dx, y: snake[0].y + dy};

        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }

        // Check self collision
        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                gameOver();
                return;
            }
        }

        snake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            generateFood();
            updateDisplay();
        } else {
            snake.pop();
        }

        drawGame();
    }

    function gameOver() {
    const loseSound = new Audio('assets/lose.mp3');
    loseSound.play();
        gameRunning = false;
        gamePaused = false;
        gameStarted = false;
        clearInterval(gameLoop);

        // Check for new high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            document.getElementById('highScore').textContent = highScore;
            document.getElementById('newRecord').style.display = 'block';
        } else {
            document.getElementById('newRecord').style.display = 'none';
        }

        updateGameStatus('💀 Game Over!', 'game-over');
        updateButtons();
        showGameOver();
    }

    function startGame() {
        // Reset game state
        snake = [{x: 10, y: 10}];
        dx = 0;
        dy = 0;
        score = 0;
        gameRunning = true;
        gamePaused = false;
        gameStarted = false; // Reset trạng thái bắt đầu

        generateFood();
        updateDisplay();
        updateGameStatus('🎮 Nhấn phím mũi tên hoặc WASD để bắt đầu!', 'playing');
        updateButtons();

        // Start game loop
        gameLoop = setInterval(updateGame, gameSpeed);
        drawGame();
    }

    function togglePause() {
        if (!gameRunning) return;

        gamePaused = !gamePaused;
        if (gamePaused) {
            updateGameStatus('⏸️ Tạm dừng', 'paused');
        } else {
            updateGameStatus('🎮 Đang chơi...', 'playing');
        }
        updateButtons();
    }

    function resetGame() {
        gameRunning = false;
        gamePaused = false;
        gameStarted = false;
        clearInterval(gameLoop);

        snake = [{x: 10, y: 10}];
        dx = 0;
        dy = 0;
        score = 0;

        generateFood();
        updateDisplay();
        updateGameStatus('🎮 Nhấn "Bắt đầu" để chơi', 'playing');
        updateButtons();
        drawGame();
    }

    function changeDirection(direction) {
        if (!gameRunning || gamePaused) return;

        // Đánh dấu game đã bắt đầu khi có hướng di chuyển đầu tiên
        if (!gameStarted) {
            gameStarted = true;
            updateGameStatus('🎮 Đang chơi...', 'playing');
        }

        switch (direction) {
            case 'UP':
                if (dy !== 1) {
                    dx = 0;
                    dy = -1;
                }
                break;
            case 'DOWN':
                if (dy !== -1) {
                    dx = 0;
                    dy = 1;
                }
                break;
            case 'LEFT':
                if (dx !== 1) {
                    dx = -1;
                    dy = 0;
                }
                break;
            case 'RIGHT':
                if (dx !== -1) {
                    dx = 1;
                    dy = 0;
                }
                break;
        }
    }

    function changeDifficulty() {
        const difficulty = document.getElementById('difficulty').value;
        gameSpeed = difficulties[difficulty];

        if (gameRunning && !gamePaused) {
            clearInterval(gameLoop);
            gameLoop = setInterval(updateGame, gameSpeed);
        }
    }

    function updateDisplay() {
        document.getElementById('score').textContent = score;
        document.getElementById('length').textContent = snake.length;
    }

    function updateGameStatus(message, className) {
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = message;
        statusElement.className = `game-status ${className}`;
    }

    function updateButtons() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');

        if (gameRunning) {
            startBtn.textContent = '🔄 Khởi động lại';
            startBtn.onclick = resetGame;
            pauseBtn.disabled = false;
            pauseBtn.textContent = gamePaused ? '▶️ Tiếp tục' : '⏸️ Tạm dừng';
        } else {
            startBtn.textContent = '🎮 Bắt đầu';
            startBtn.onclick = startGame;
            pauseBtn.disabled = true;
            pauseBtn.textContent = '⏸️ Tạm dừng';
        }
    }

    function showGameOver() {
        document.getElementById('finalScore').textContent = score;
        document.getElementById('finalLength').textContent = snake.length;
        document.getElementById('overlay').classList.add('show');
        document.getElementById('gameOverMessage').classList.add('show');
    }

    function closeGameOver() {
        document.getElementById('overlay').classList.remove('show');
        document.getElementById('gameOverMessage').classList.remove('show');
    }

    function showInstructions() {
        alert('🐍 Hướng dẫn chơi Snake:\n\n' +
            '• Sử dụng phím mũi tên hoặc WASD để điều khiển rắn\n' +
            '• Ăn táo đỏ để tăng điểm và chiều dài\n' +
            '• Tránh va chạm tường và thân rắn\n' +
            '• Phím Space để tạm dừng/tiếp tục\n' +
            '• Trên mobile: sử dụng nút điều khiển\n' +
            '• Chọn tốc độ phù hợp để thử thách bản thân!');
    }

    // Event listeners
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
            case 'w': // Thêm phím 'w'
                e.preventDefault();
                changeDirection('UP');
                break;
            case 'ArrowDown':
            case 's': // Thêm phím 's'
                e.preventDefault();
                changeDirection('DOWN');
                break;
            case 'ArrowLeft':
            case 'a': // Thêm phím 'a'
                e.preventDefault();
                changeDirection('LEFT');
                break;
            case 'ArrowRight':
            case 'd': // Thêm phím 'd'
                e.preventDefault();
                changeDirection('RIGHT');
                break;
            case ' ':
                e.preventDefault();
                togglePause();
                break;
        }
    });

    // Touch support for mobile
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (!gameRunning || gamePaused) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 30) {
                changeDirection('LEFT');
            } else if (diffX < -30) {
                changeDirection('RIGHT');
            }
        } else {
            if (diffY > 30) {
                changeDirection('UP');
            } else if (diffY < -30) {
                changeDirection('DOWN');
            }
        }
    });

    // Initialize game when page loads
    window.onload = function() {
        initGame();
    };
