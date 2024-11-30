// To place letters in
let wordleContainer = document.getElementById("wordle");

let triesContainer = document.getElementById("tries");

let guessButton = document.getElementById("guess");

let sovledMsg = document.getElementById("sovled-msg");
let failedMsg = document.getElementById("failed-msg");

// TODO: Add more words, probably from an actual dictionary
let wordList5 = ["wordy", "treat", "horse", "house", "ready", "radio", "joker", "jaunt", "money", "sweet", "sweat", "swing", "feast", "three", "clear", "guess", "roast", "write", "model", "drawn", "mouse", "paint", "green", "wrong", "means", "braid", "reset", "start", "solve"];
let wordList4 = ["four", "test", "hour", "tour", "rest", "more", "word"]
let wordList3 = ["one", "two", "own", "fun", "run", "red"];

// A list of all the different lenght word lists
wordLists = [ wordList3, wordList4, wordList5 ];

// The current word list
let wordList = wordList5;

// Max number of tries for the game
let tries = 5;

// If the Wordle has been solved
let solved = false;
let tryNum = 0;

// The number of letters in the word
let wordSize = 0;
let word = "";

// Starts by creating the Wordle layout
createWordle();

// Create the layout for the game of Wordle
function createWordle() {	
	selectWord();
	
	// For each letter,
	for(let i = 0; i < wordSize; i++) {
		let newLetter = document.createElement("input");
		newLetter.classList.add("letter");
		newLetter.maxLength = 1;
		newLetter.addEventListener("input", validateGuess);
		
		newLetter.addEventListener("keyup", autofocus(this));
		
		wordleContainer.append(newLetter);
	}
	
	// For each try, generate empty space
	for(let i = 0; i< tries; i++) {
		let newTry = document.createElement("div");
		newTry.classList.add("try");
		triesContainer.append(newTry);
	}
}

function autofocus() {
    /*// Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13 || this.value.length == 1) {
      // Focus on the next sibling
      this.nextElementSibling.focus()
    }*/
}

// Reset the game
function reset() {
	tryNum = 0;
	solved = false;
	
	// Hide the ending messages
	sovledMsg.style.display = "none";
	failedMsg.style.display = "none";
}

// Restart the game with a new word, erasing previous guesses
function restart() {
	reset();
	
	// Clear all previous guesses
	for(let i = 0; i < tries; i++) {
		triesContainer.children[i].innerHTML = "";
	}
	
	// Clear the guessing area
	for(let i = 0; i < wordSize; i++) {
		wordleContainer.children[i].value = "";
	}	
	
	// Pick a random word for the next game
	selectWord();
}

// Restart the game, possibly picking from a different list of words
function restartRandom() {
	let random = Math.floor(Math.random() * (wordLists.length));
	wordList = wordLists[random];
	
	// Reset the game's stats
	reset();
	
	// Clear the previous setup
	wordleContainer.innerHTML = "";
	triesContainer.innerHTML = "";
	
	// Setup the game with a word from the current list
	createWordle();
}

// Select a random word from the current word list
function selectWord() {
	let random = Math.floor(Math.random() * (wordList.length));
	word = wordList[random];
	wordSize = word.length;
}

// Ensure the guess is an actual word
function validateInput() {
	// Create a string of the inputted word
	let inputWord = "";
	for(let i = 0; i < wordSize; i++) {
		inputWord += wordleContainer.children[i].value;
	}
	
	// Must be in the word list
	let valid = wordList.includes(inputWord);
	console.log("Guess " + inputWord + " is " + (valid ? "" : "not ") + "in the list of words"); // DEBUG
	return valid;
}

function validateGuess() {
	if(validateInput()) {
		// Add valid as a class
		guessButton.classList.add("valid");
	}
	else {
		// Remove valid as a class
		guessButton.className = "";
	}
}

// The game is over if the wordle has been solved or the user is out of tries
function isGameOver() {
	return solved || (tryNum >= tries);
}

// Called when the user submits a guess
function gradeInput() {
	// If the game is not over,
	if(!isGameOver()) {
		// If the user submitted a valid word,
	if (validateInput()) {	
		// Filling in the current try section,
		currentTry = triesContainer.children[tryNum];		
		let correctLetters = 0;
		
		// For each letter in the guess,
		for(let i = 0; i < wordSize; i++) {
			// Create a div to show each letter's grade
			let newLetter = document.createElement("div");
			newLetter.classList.add("letter");
			
			// Get a letter from the user's guess
			let letter = wordle.children[i].value.toLowerCase();
			newLetter.innerHTML = letter;
			
			// Grade the letter (red - not in word, yellow - in word, but wrong spot, green - correct spot) 
			let grade = "incorrect";
			if(letter != "" && letter != " ") {
			if(word[i] == letter) {
				grade = "correct";
				correctLetters++;				
			}
			else if (word.includes(letter)) {
				grade = "wrong-location";
			}
		}
			// Add the grade as a class (displayed differently)
			newLetter.classList.add(grade);
	
			// Add the div to be displayed
			currentTry.append(newLetter);
		}
		
		tryNum++;
		
		// If the word was solved,
		if (correctLetters == wordSize) {
			solved = true;
			sovledMsg.style.display = "block";
		}
		// Otherwise if the user used their last try,
		else if(isGameOver()) {
			failedMsg.style.display = "block";
		}
		
	} else {
		// Show error, invalid word
	}
	}
	// Otherwise, game is over
}

// Hide the given document element
function hide(item) {
  item.style.display = "none";
}