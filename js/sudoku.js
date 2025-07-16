
        // Game state
        let sudokuBoard = [];
        let solvedBoard = [];
        let selectedCell = null;
        let timer = 0;
        let timerInterval = null;
        let gameStarted = false;
        let errorCount = 0;
        let hintCount = 3;
        let givenCells = [];

        // Initialize game
        function initGame() {
            createBoard();
            generatePuzzle();
            startTimer();
            updateDisplay();
        }

        // Create 9x9 board
        function createBoard() {
            const board = document.getElementById('sudokuBoard');
            board.innerHTML = '';
            
            for (let i = 0; i < 81; i++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.index = i;
                cell.addEventListener('click', () => selectCell(i));
                board.appendChild(cell);
            }
        }

        // Generate solved board using backtracking
        function generateSolvedBoard() {
            const board = Array(9).fill(null).map(() => Array(9).fill(0));
            
            function isValid(board, row, col, num) {
                // Check row
                for (let i = 0; i < 9; i++) {
                    if (board[row][i] === num) return false;
                }
                
                // Check column
                for (let i = 0; i < 9; i++) {
                    if (board[i][col] === num) return false;
                }
                
                // Check 3x3 box
                const boxRow = Math.floor(row / 3) * 3;
                const boxCol = Math.floor(col / 3) * 3;
                for (let i = boxRow; i < boxRow + 3; i++) {
                    for (let j = boxCol; j < boxCol + 3; j++) {
                        if (board[i][j] === num) return false;
                    }
                }
                
                return true;
            }
            
            function solve(board) {
                for (let row = 0; row < 9; row++) {
                    for (let col = 0; col < 9; col++) {
                        if (board[row][col] === 0) {
                            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                            // Shuffle numbers for randomness
                            for (let i = numbers.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
                            }
                            
                            for (let num of numbers) {
                                if (isValid(board, row, col, num)) {
                                    board[row][col] = num;
                                    if (solve(board)) return true;
                                    board[row][col] = 0;
                                }
                            }
                            return false;
                        }
                    }
                }
                return true;
            }
            
            solve(board);
            return board;
        }

        // Generate puzzle by removing numbers
        function generatePuzzle() {
            const difficulty = document.getElementById('difficulty').value;
            const solved = generateSolvedBoard();
            const puzzle = solved.map(row => [...row]);
            
            // Difficulty settings
            const difficultySettings = {
                easy: { cellsToRemove: 40 },
                medium: { cellsToRemove: 46 },
                hard: { cellsToRemove: 51 },
                expert: { cellsToRemove: 56 }
            };
            
            const settings = difficultySettings[difficulty];
            let cellsRemoved = 0;
            const positions = [];
            
            // Create array of all positions
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    positions.push([i, j]);
                }
            }
            
            // Shuffle positions
            for (let i = positions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [positions[i], positions[j]] = [positions[j], positions[i]];
            }
            
            // Remove cells
            for (let [row, col] of positions) {
                if (cellsRemoved >= settings.cellsToRemove) break;
                
                const backup = puzzle[row][col];
                puzzle[row][col] = 0;
                
                // Check if puzzle still has unique solution (simplified check)
                if (hasUniqueSolution(puzzle)) {
                    cellsRemoved++;
                } else {
                    puzzle[row][col] = backup;
                }
            }
            
            solvedBoard = solved;
            sudokuBoard = puzzle;
            givenCells = [];
            
            // Mark given cells
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (puzzle[i][j] !== 0) {
                        givenCells.push(i * 9 + j);
                    }
                }
            }
        }

        // Simple check for unique solution (not perfect but good enough)
        function hasUniqueSolution(board) {
            const solutions = [];
            
            function solve(board, solutions) {
                if (solutions.length > 1) return; // Early exit if multiple solutions
                
                for (let row = 0; row < 9; row++) {
                    for (let col = 0; col < 9; col++) {
                        if (board[row][col] === 0) {
                            for (let num = 1; num <= 9; num++) {
                                if (isValidMove(board, row, col, num)) {
                                    board[row][col] = num;
                                    solve(board, solutions);
                                    board[row][col] = 0;
                                }
                            }
                            return;
                        }
                    }
                }
                
                // Found a complete solution
                solutions.push(board.map(row => [...row]));
            }
            
            solve(board.map(row => [...row]), solutions);
            return solutions.length === 1;
        }

        // Check if move is valid
        function isValidMove(board, row, col, num) {
            // Check row
            for (let i = 0; i < 9; i++) {
                if (board[row][i] === num) return false;
            }
            
            // Check column
            for (let i = 0; i < 9; i++) {
                if (board[i][col] === num) return false;
            }
            
            // Check 3x3 box
            const boxRow = Math.floor(row / 3) * 3;
            const boxCol = Math.floor(col / 3) * 3;
            for (let i = boxRow; i < boxRow + 3; i++) {
                for (let j = boxCol; j < boxCol + 3; j++) {
                    if (board[i][j] === num) return false;
                }
            }
            
            return true;
        }

        // Select cell
        function selectCell(index) {
            if (givenCells.includes(index)) return;
            
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => cell.classList.remove('selected'));
            
            selectedCell = index;
            cells[index].classList.add('selected');
        }

        // Select number from pad
        function selectNumber(num) {
            if (selectedCell === null) return;
            
            const row = Math.floor(selectedCell / 9);
            const col = selectedCell % 9;
            const cells = document.querySelectorAll('.cell');
            
            if (num === 0) {
                // Erase
                sudokuBoard[row][col] = 0;
                cells[selectedCell].textContent = '';
                cells[selectedCell].classList.remove('error', 'hint');
            } else {
                // Place number
                if (isValidMove(sudokuBoard, row, col, num)) {
                    sudokuBoard[row][col] = num;
                    cells[selectedCell].textContent = num;
                    cells[selectedCell].classList.remove('error', 'hint');
                    
                    // Check if game is complete
                    if (isGameComplete()) {
                        endGame();
                    }
                } else {
                    // Invalid move
                    sudokuBoard[row][col] = num;
                    cells[selectedCell].textContent = num;
                    cells[selectedCell].classList.add('error');
    const loseSound = new Audio('assets/lose.mp3');
    loseSound.play();
                    errorCount++;
                    
                    // Remove error after 1 second
                    setTimeout(() => {
                        if (sudokuBoard[row][col] === num) {
                            sudokuBoard[row][col] = 0;
                            cells[selectedCell].textContent = '';
                            cells[selectedCell].classList.remove('error');
                        }
                    }, 1000);
                }
            }
            
            updateDisplay();
        }

        // Show hint
        function showHint() {
            if (hintCount <= 0 || selectedCell === null) return;
            
            const row = Math.floor(selectedCell / 9);
            const col = selectedCell % 9;
            
            if (sudokuBoard[row][col] === 0) {
                const correctNum = solvedBoard[row][col];
                sudokuBoard[row][col] = correctNum;
                
                const cells = document.querySelectorAll('.cell');
                cells[selectedCell].textContent = correctNum;
                cells[selectedCell].classList.add('hint');
                
                hintCount--;
                updateDisplay();
                
                if (isGameComplete()) {
                    endGame();
                }
            }
        }

        // Check if game is complete
        function isGameComplete() {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (sudokuBoard[i][j] === 0) return false;
                }
            }
            return true;
        }

        // End game
        function endGame() {
    const winSound = new Audio('assets/win.mp3');
    winSound.play();
            clearInterval(timerInterval);
            gameStarted = false;
            
            const overlay = document.getElementById('overlay');
            const successMessage = document.getElementById('successMessage');
            const finalTime = document.getElementById('finalTime');
            const finalErrors = document.getElementById('finalErrors');
            
            finalTime.textContent = formatTime(timer);
            finalErrors.textContent = errorCount;
            
            overlay.classList.add('show');
            successMessage.classList.add('show');
        }

        // Close success modal
        function closeSuccess() {
            const overlay = document.getElementById('overlay');
            const successMessage = document.getElementById('successMessage');
            
            overlay.classList.remove('show');
            successMessage.classList.remove('show');
        }

        // New game
        function newGame() {
            clearInterval(timerInterval);
            timer = 0;
            errorCount = 0;
            hintCount = 3;
            selectedCell = null;
            gameStarted = false;
            
            // Clear all cells
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.textContent = '';
                cell.className = 'cell';
            });
            
            initGame();
        }

        // Clear board (only user inputs)
        function clearBoard() {
            const cells = document.querySelectorAll('.cell');
            
            for (let i = 0; i < 81; i++) {
                if (!givenCells.includes(i)) {
                    const row = Math.floor(i / 9);
                    const col = i % 9;
                    sudokuBoard[row][col] = 0;
                    cells[i].textContent = '';
                    cells[i].classList.remove('error', 'hint');
                }
            }
            
            updateDisplay();
        }

        // Update display
        function updateDisplay() {
            const cells = document.querySelectorAll('.cell');
            
            // Update board display
            for (let i = 0; i < 81; i++) {
                const row = Math.floor(i / 9);
                const col = i % 9;
                const value = sudokuBoard[row][col];
                
                if (value !== 0) {
                    cells[i].textContent = value;
                }
                
                // Mark given cells
                if (givenCells.includes(i)) {
                    cells[i].classList.add('given');
                }
            }
            
            // Update counters
            document.getElementById('errorCount').textContent = errorCount;
            document.getElementById('hintCount').textContent = hintCount;
            
            // Update completed count
            let completed = 0;
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (sudokuBoard[i][j] !== 0) completed++;
                }
            }
            document.getElementById('completedCount').textContent = `${completed}/81`;
        }

        // Timer functions
        function startTimer() {
            if (gameStarted) return;
            gameStarted = true;
            
            timerInterval = setInterval(() => {
                timer++;
                document.getElementById('timer').textContent = formatTime(timer);
            }, 1000);
        }

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '9') {
                selectNumber(parseInt(e.key));
            } else if (e.key === 'Delete' || e.key === 'Backspace') {
                selectNumber(0);
            } else if (e.key === 'h' || e.key === 'H') {
                showHint();
            }
        });

        // Initialize game on load
        window.addEventListener('load', initGame);
    