// The file where all words are stored/retrieved
import * as words from "./words.js"

// TODO: Add asserts and tests to ensure page/game is in a valid state

// A list of all the different length word lists
let wordLists = {3:  words.get3LetterWords(), 4: words.get4LetterWords(), 5: words.get5LetterWords()};

// The HTML elemen where the user enters letters to guess the word
let wordleContainer = document.getElementById("wordle");

// The HTML element where the user's previous guesses are shown
let triesContainer = document.getElementById("tries");

// The HTML element that allows the user to submit a guess
let guessButton = document.getElementById("guess");

// Where the word is revealed to the user
let revealWord = document.getElementById("revealWord");
let guessWord = document.getElementById("guessWord");

// The HTML elements that show the solved and failure messages
let sovledMsg = document.getElementById("sovled-msg");
let failedMsg = document.getElementById("failed-msg");

let invalidMsg = document.getElementById("invalid-msg");

// TODO [STRETCH GOAL]: Allow user to pick wordlists by theme (can they be different length? Or must all be same length?)
// The current word list
let wordList = wordLists["5"];

let tries = 5; 			// Max number of tries for the game
let tryNum = 0; 		// The number of tries the user has used
let solved = false; 	// If the Wordle has been solved
let word = ""; 			// The randomly selected word
let wordSize = 0; 		// The number of letters in the word

// Setup the links between buttons and functions
buttonSetup();

// Create the layout for the Wordle guessing board
createWordle();

// Create the layout for the game of Wordle
function createWordle() {
	// Select a random word from the current wordlist
	selectWord();
	
	// For each letter of the current word,
	for(let i = 0; i < wordSize; i++) {
		let newLetter = document.createElement("input");
		newLetter.autocomplete = "off";
		newLetter.classList.add("letter");
		newLetter.id = "letter" + i;
		newLetter.maxLength = 1;
		newLetter.addEventListener("input", validateGuess);

		// TODO: Move between boxes as if a singular textbox
		newLetter.addEventListener("keyup", autofocus);
		
		wordleContainer.append(newLetter);
	}
	
	// For each try, generate empty space
	for(let i = 0; i< tries; i++) {
		let newTry = document.createElement("div");
		newTry.classList.add("try");
		triesContainer.append(newTry);
	}
}

// TODO [FEATURE]: If box is filled and a letter key is pressed, replace with new letter
// TODO [ERROR]: Input lag (can't type at normal speed, delay between keypress and changed focus), may be better to actually have it be one form and use css to split letters? Actual Wordle changes the innerHTML of a div, probably uses a general keypress event
// Focuses on the correct form element
function autofocus(event) {
	// TODO: Follow Tab flow (There already is an order of elm focused on using tab)
	// Get the id of the current letter guess box
	let i = parseInt(this.id.toString()[6])

	// Get the key that was pressed
	let key = event.key
	//console.log(key);

	// TODO [ERROR HANDLING]: Ensure only alphabet characters are entered
	//if(key.match(/[a-z]/i))

	// The current element to focus on
	let currentElm = this;

	// If the user wants to move back a box,
	if(key == "ArrowLeft" || key == "Backspace") {
		console.log("move left");
		if(i != 0 && i <= wordSize) {
			i--; // Move to previous box
			currentElm = document.getElementById("letter"+ i);
		}
	}
	else if (key == "Tab") {
		// Do nothing, use normal flow
	}
	// If the user pressed any other key,
	else {
		// If the box is currently filled,
		if(currentElm.value.length >= 1 && key.length == 1) {
			console.log("Input is full! Change to key")
			currentElm.value = key;
		}

		// If the next index is out of bounds,
		if (i + 1 >= wordSize) {
			// Move to the guess button
			guessButton.focus();
			return;
		}
		else {
			i++; // Move to next box
			currentElm = document.getElementById("letter" + i);
		}
	}

	// Focus on the current element
	currentElm.focus();

	// Move the cursor to the end of the box
	currentElm.setSelectionRange(1, 1);
}

// Reset the game
function reset() {
	tryNum = 0;
	solved = false;
	
	// Don't allow the user to find the word using inspect lol
	guessWord.innerHTML = "";
	revealWord.innerHTML = "";

	// Hide messages to the user
	toggleShow(invalidMsg, false);
	toggleShow(sovledMsg, false);
	toggleShow(failedMsg, false);
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
	// Randomly pick a word list
	let random = Math.floor(Math.random() * (Object.keys(wordLists).length));
	wordList = wordLists[Object.keys(wordLists)[random]];
	
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
	//console.log("Guess " + inputWord + " is " + (valid ? "" : "not ") + "in the list of words"); // DEBUG
	return valid;
}

// Add "valid" class to guessButton if the user's guess is in the wordlist
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

// Get the user's guess as a single string
function getGuess() {
	let guess = "";
	// Build the word from each box
	for(let i = 0; i < wordSize; i++) {
		guess += wordle.children[i].value.toLowerCase();
	}
	return guess
}

// Called when the user submits a guess
function gradeInput() {
	// Get the guess and add it to the HTML
	let guess = getGuess();
	guessWord.innerHTML = guess;

	// If the game is not over,
	if(!isGameOver()) {
	// If the user submitted a valid word,
	if (validateInput()) {
		// Hide the "invalid guess" message
		toggleShow(invalidMsg, false);

		// Filling in the current try section,
		let currentTry = triesContainer.children[tryNum];		
		let correctLetters = 0;
		
		// For each letter in the guess,
		for(let i = 0; i < wordSize; i++) {
			// Create a div to show each letter's grade
			let newLetter = document.createElement("div");
			newLetter.classList.add("letter");
			
			// Get a letter from the user's guess
			let letter = guess[i];
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
			// Add the grade as a class to display the appropriate CSS
			newLetter.classList.add(grade);
	
			// Add the element to the DOM
			currentTry.append(newLetter);
		}
		
		// The user uses up a try
		tryNum++;
		
		// If the word was correctly guessed,
		if (correctLetters == wordSize) {
			solved = true;
			toggleShow(sovledMsg, true);
		}
		// Otherwise if the user used their last try,
		else if(isGameOver()) {
			// Reveal the word to the user
			revealWord.innerHTML = word;
			toggleShow(failedMsg, true);
		}
		
	} else {
		// Tell the user their word isn't valid (TEMP: Not in word list, will later expand list)
		toggleShow(invalidMsg, true);
	}
	}
	// Otherwise, game is over
}

// Show/hides the given HTML element
function toggleShow(item, visible) {
	if(visible) {
		item.style.display = "block";
	}
	else {
		item.style.display = "none";
	}
}

// Add event listeners to HTML elements/buttons
function buttonSetup() {
	// Allows the user to submit a guess
	guessButton.addEventListener("click", gradeInput);
	guessButton.addEventListener("keyup", function(event) {
		let key = event.key
		if(key == "ArrowLeft" || key == "Backspace") {
			let id = "letter" + (wordSize - 1);
			document.getElementById(id).focus();
		}
	})

	// Allows the user to restart their game using the same wordlist
	let restartButton = document.getElementById("restart");
	restartButton.addEventListener("click", restart);

	// Allows the user to restart their game using a randomly selected wordlist
	let restartRandomButton = document.getElementById("restart-random");
	restartRandomButton.addEventListener("click", restartRandom);
}