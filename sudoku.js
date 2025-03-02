let board = [];
let solution = [];
let currentDifficulty = 'easy';
let userInputs = Array(9).fill().map(() => Array(9).fill(false));

// Difficulty settings (number of cells to remove)
const difficulties = {
    easy: 30,
    medium: 40,
    hard: 50,
    expert: 60
};

// Initialize the game
function initializeGame() {
    createEmptyBoard();
    generateSolution();
    createPuzzle();
    displayBoard();
}

// Create empty 9x9 board
function createEmptyBoard() {
    board = Array(9).fill().map(() => Array(9).fill(0));
    solution = Array(9).fill().map(() => Array(9).fill(0));
}

// Check if a number is valid in the given position
function isValid(grid, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) return false;
    }

    // Check 3x3 box
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) return false;
        }
    }

    return true;
}

// Generate a complete solution
function generateSolution() {
    function fillBoard(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    let numbers = [1,2,3,4,5,6,7,8,9];
                    numbers.sort(() => Math.random() - 0.5);
                    
                    for (let num of numbers) {
                        if (isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (fillBoard(grid)) return true;
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    fillBoard(solution);
    console.log(solution);
    for (let i = 0; i < 9; i++) {
        board[i] = [...solution[i]];
    }
    
}

// Create puzzle by removing numbers based on difficulty
function createPuzzle() {
    const cellsToRemove = difficulties[currentDifficulty];
    let count = 0;
    
    while (count < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            count++;
        }
    }
}

// Display the board in the HTML
function displayBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (board[i][j] !== 0) {
                cell.textContent = board[i][j];
                cell.classList.add('fixed');
            } else {
                cell.addEventListener('click', () => handleCellClick(cell, i, j));
            }
            boardDiv.appendChild(cell);
        }
    }
}

// Handle cell click
function handleCellClick(cell, row, col) {
    // Remove any existing number selector
    const existingSelector = document.querySelector('.number-selector');
    if (existingSelector) existingSelector.remove();

    // Create and position the number selector
    const selector = document.createElement('div');
    selector.className = 'number-selector';
    
     // Add this line when a number is selected
     userInputs[row][col] = true; // Mark this cell as filled by the user

    // Calculate position
    const cellRect = cell.getBoundingClientRect();
    selector.style.top = `${cellRect.bottom + window.scrollY + 5}px`;
    selector.style.left = `${cellRect.left + window.scrollX}px`;

    // Add number options
    for (let i = 1; i <= 9; i++) {
        const option = document.createElement('div');
        option.className = 'number-option';
        option.textContent = i;
        option.onclick = () => {
            board[row][col] = i;
            cell.textContent = i;
            selector.remove();
            // Remove the incorrect class if it exists
            cell.classList.remove('incorrect');
        };
        selector.appendChild(option);
    }

    document.body.appendChild(selector);

    // Close selector when clicking outside
    document.addEventListener('click', function closeSelector(e) {
        if (!selector.contains(e.target) && e.target !== cell) {
            selector.remove();
            document.removeEventListener('click', closeSelector);
        }
    });
}

// Check if the current solution is correct
function checkSolution() {
    const messageDiv = document.getElementById('message');
    let isCorrect = true;
    const cells = document.querySelectorAll('.cell');

    // Remove all cell markings
    cells.forEach(cell => {
        cell.classList.remove('incorrect');
        cell.classList.remove('correct');
    });

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cellIndex = i * 9 + j;
            if (board[i][j] !== solution[i][j]) {
                isCorrect = false;
                if (!cells[cellIndex].classList.contains('fixed')) {
                    cells[cellIndex].classList.add('incorrect');
                }
            } else if (!cells[cellIndex].classList.contains('fixed')) {
                cells[cellIndex].classList.add('correct');
            }
        }
    }

    if (isCorrect) {
        messageDiv.className = 'success';
        messageDiv.textContent = 'Congratulations! You solved the puzzle!';
    } else {
        messageDiv.className = 'error';
        messageDiv.textContent = 'Not quite right. Keep trying!';
    }
}

// Clear the board
function clearBoard() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (userInputs[i][j]) { // Only clear if it was filled by the user
                board[i][j] = 0; // Reset user input
                userInputs[i][j] = false; // Reset tracking
            }
        }
    }
    displayBoard(); // Update display with cleared inputs
    document.getElementById('message').textContent = ''; // Clear any messages
}

// Start a new game
function newGame() {
    currentDifficulty = document.getElementById('difficulty').value;
    initializeGame();
    document.getElementById('message').textContent = '';
}

// Initialize the game when the page loads
window.onload = initializeGame;




const gameState = JSON.stringify({ board, difficulty: currentDifficulty });




