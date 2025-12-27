/* TODO:
- [GAMERULE]: First click is always safe (aka, board generates after user clicks, based around user's click location)
-   The 8 squares around the user will not have mines (aka, clicked spot will be surroundingMines = 0)
-   "Flood-fill" to reveal any 0s and their neighbors (to see counts for hidden areas)
- [FEATURE]: Have a mines:total squares ratio to allow for multiple board sizes
- [FEATURE]: Better mine generation to ensure guessing isn't needed
*/


// To display the user's best score
let highScore = document.getElementById("scores__highest");
// To display the user's current score
let currentScore = document.getElementById("scores__current");
// To place buttons in
let boardContainer = document.getElementById("board");
// The board's width and height
let boardSize = 5

let isGameOver = false;

// The rarity of mines as a fraction
let mineRarity = .25;

// TODO: Do min/max need to be anything other than just ints?
let min = 0;
let max = 10;

// On load, create the board
createBoard();

// Create the Minesweeper board
function createBoard() {
	// For each column
	for(let i = 0; i < boardSize; i++) {
		// Create a new row
		let newRow = document.createElement("div");
		newRow.classList.add("board__row-" + (i + 1));
		
		// For each row,
		for(let j = 0; j < boardSize; j++) {
		
		// Create a new button
		let newButton = document.createElement("button");
		
		// Bug?? When empty or whitespace, adding text moves the box?
		newButton.innerHTML = "&#9830;";
		newButton.id = "cell-" + ((i * boardSize) + j)
		
		// On click, the button is disabled and either adds points or results in a game over
		newButton.addEventListener("click", buttonFun);
		
		// Determine if it is a mine or not
		let isMine = (Math.floor(Math.random() * (max - min)) + min) < (max - min) * mineRarity;
		if(isMine) {
			newButton.classList.add("mine");
		}
		else {
			newButton.classList.add("notMine");
		}
		
		// Add it to the row
		newRow.appendChild(newButton);
	}
		// Add the row to the board
		boardContainer.appendChild(newRow);
	
	}
}

// Called when a cell is pressed
function buttonFun(event) {
    console.log("Button pressed!")
    if(!isGameOver) {
        let button = event.target
        button.disabled = true;

        // GameOver or continue
        if (button.classList.contains("mine")) {
            console.log("Gameover!");
            button.innerHTML = "*";
            gameOver();
        }
        else {
            button.innerHTML = countMines(button);
            addPoints();
        }
        
        console.log("Pressed " + button.id + ". Game is " + isGameOver ? "" : "not " + "over.");
    }
}

function countMines(el) {
	// Count the number of mines surrounding the given button
	//cell-# limit to 0 to boardSize -1
	let id = (el.id).replace("cell-", "");
	let checkId = id;
	let count = 0;
	
	console.log("This is id: " + id);
	
	// All the spaces around the current cell
	let checkIds = [];
	
	// If NOT first row,
	if(parseInt(id) - boardSize >= 0) {
		// Check row above		
		checkIds.push(parseInt(id) - boardSize); // - row
	}
	// If NOT last row,
	if(parseInt(id) + boardSize < (boardSize*2)) {
		// Check row below	
		checkIds.push(parseInt(id) + boardSize); // + row			
	}
	
	// If NOT first box in the row,
	if((parseInt(id) % boardSize) != 0) {
		// Check box before
		checkIds.push(parseInt(id) - 1); // - 1
		
		// If NOT first row,
		if(parseInt(id) - boardSize >= 0) {
			checkIds.push(parseInt(id) - (boardSize - 1)); // - row - 1
		}
		// If NOT last row,
		if(parseInt(id) + boardSize < (boardSize*2)) {
			checkIds.push(parseInt(id) + (boardSize - 1)); // + row - 1
		}
	}
	
	// If NOT last box in the row,
	if((parseInt(id) % boardSize) != (boardSize - 1)) {
		// Check box after
		checkIds.push(parseInt(id) + 1); // + 1
		
		// If NOT first row,
		if(parseInt(id) - boardSize >= 0) {		
			// Check box in the row before and box after
			checkIds.push(parseInt(id) - (boardSize + 1)); // - row + 1
		}
		// If NOT last row,
		if(parseInt(id) + boardSize < (boardSize*2)) {		
			// Check box in the row after and box after	
			checkIds.push(parseInt(id) + (boardSize + 1)); // + row + 1
		}
	}
	
	let checkCount = 0;
	console.log("Checking " + checkIds.length + " cells around " + el.id);
	
	// For each cell around the current cell,
	for(let i = 0; i < checkIds.length; i++) {
		console.log("Checking cell-" + checkIds[i]);
			// If the item is a "mine"
			if(document.getElementById("cell-" + checkIds[i]).classList.contains("mine")) {
				count++;
			}		
	}
	
	console.log("There are " + checkCount + " cells around " + el.id )
	return count;
}

// Give the user points for not hitting a mine
function addPoints() {
	if(!isGameOver) {
        let points = Number(currentScore.innerHTML)
        points += 5;
        currentScore.innerHTML = points;
	}
}

// Reset the board and create new buttons
function resetBoard() {
	boardContainer.innerHTML = "";
	createBoard();
}

// When the user fails, show gameOver
function gameOver() {
  var popup = document.getElementById("gameOver");
  popup.style.display = "block";
  isGameOver = true;
}

// Reset the game
function reset() {
	// Get all popups and hide them
	var popups = document.getElementsByClassName("popup");
	if(popups.length > 1) {
	popups.forEach(hide);
	}
	else if(popups.length == 1) {
		hide(popups[0]);
	}
	
	// If the high score was beaten, update it
	if(Number(currentScore.innerHTML) > Number(highScore.innerHTML)) {
		highScore.innerHTML = currentScore.innerHTML;
	}
	
	// Reset the current score and the board
	currentScore.innerHTML = "0";
	isGameOver = false;
	resetBoard();
}

function revealAll() {
	// Foreach cell in boardContainer,
    
}

function reveal(scoring = true) {
    item.style.display;
	
}

// Hide the given document element
function hide(item) {
  item.style.display = "none";
}