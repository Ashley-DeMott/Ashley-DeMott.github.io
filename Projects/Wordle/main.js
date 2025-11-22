// The file where all words are stored/retrieved
import * as words from "./words.js"

// TODO [FEATURE]: Various features to improve gameplay
// - Update green/yellow/red guide's CSS
// - Beter CSS and animations like NYT Wordle
// - Have messages be in an actual popup/alert instead of above the board
// - Create mobile and desktop views
// - If !gameOver(), have alert/prompt to confirm reset of the game
// - Add user options with boolean math. Ex: removeLetter(true * (userSettings.moveOnRemove))

// TODO [FEATURE]: Different modes using similar layout and word list
// - Unlimited guesses (update gameOver function (tryNum >= tries && !unlimitedGuessMode))
// - Allow user to pick wordlists by theme (like Wheel of Fortune, displays category and size of word)
// - Scramble word, show scrambled and allow user to guess the unscrambled word

// TODO: Add asserts and tests to ensure page/game is in a valid state

// A list of all the different length word lists
let wordLists = { 3: words.get3LetterWords(), 4: words.get4LetterWords(), 5: words.get5LetterWords() };

// The HTML element where the user enters letters to guess the word
let wordleContainer = document.getElementById("wordle");

// The HTML element where the user's previous guesses are shown
let triesContainer = document.getElementById("tries");

// The HTML element that allows the user to submit a guess
let guessButton = document.getElementById("guess");

// The HTML element that allows the user to play again
let playAgainButton = document.getElementById("restart");

// Where the word is revealed to the user
let revealWord = document.getElementById("revealWord");
let guessWord = document.getElementById("guessWord");

// The HTML elements that show the solved and failure messages
let sovledMsg = document.getElementById("sovled-msg");
let failedMsg = document.getElementById("failed-msg");
let invalidMsg = document.getElementById("invalid-msg");

// The HTML element that holds all keyboard elements
let keyboard = document.getElementById("keyboard");
let delKey;

// The current word list
let wordList = wordLists["5"];

let tries = 6; 			// Max number of tries for the game
let tryNum = 0; 		// The number of tries the user has used
let solved = false; 	// If the Wordle has been solved
let word = ""; 			// The randomly selected word
let wordSize = 0; 		// The number of letters in the word

let currentLetter = 0;  // The currently selected input letter

// Setup the links between buttons and functions
buttonSetup();

// Create the layout for the Wordle guessing board
createWordle();

// Create the layout for the keyboard
organizeKeyboard();

// Create the layout for the game of Wordle
function createWordle() {
    // Select a random word from the current wordlist
    selectWord();

    // For each letter of the current word,
    for (let i = 0; i < wordSize; i++) {
        let newLetter = document.createElement("input");
        newLetter.type = "text";
        newLetter.autocomplete = "off";
        newLetter.classList.add("letter");
        newLetter.id = "letter" + i;
        newLetter.maxLength = 1;
        newLetter.style.caretColor = "transparent";

        // Check if the current word can be submitted
        newLetter.addEventListener("input", validateGuess);

        // If box is clicked on, focus on it (update currentLetter)
        newLetter.addEventListener("click", () => guessBoxFocus(i));

        // When a key is pressed, determine what to do with the input
        newLetter.addEventListener("keydown", handleInput);

        // When an animation ends, clear animations
        newLetter.addEventListener('animationend', () => {
        newLetter.style.animation = 'none'; });

        // Add to DOM
        wordleContainer.append(newLetter);
    }

    // For each try, generate empty space
    for (let i = 0; i < tries; i++) {
        let newTry = document.createElement("div");
        newTry.classList.add("try");
        triesContainer.append(newTry);
    }
}

// Create the keyboard letters, organizing them according to the given row layout
// Each row of the QWERTY keyboard, can also be defined other ways
function organizeKeyboard(rows = {
        "1": ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        "2": ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        "3": ['z', 'x', 'c', 'v', 'b', 'n', 'm']}) {

    // The id prefix for keyboard letters
    let letterIDPrefix = "keyboard-letter-";
    let rowIDPrefix = "keyboard-row-";

    // For each row,
    for (let row in rows) {
        // TODO [CLEANUP]: Can rewrite as a function (and call here) to allow letters to be reorganized into different sections throughout the game. Only create a section if it doesn't exist [In the case of showing letters hangman style (correct | unguessed | incorrect)].
        // Create a row element
        let newRow = document.createElement("div");
        newRow.id = rowIDPrefix + row;

        // Organize the letter into its proper row
        for (let letter in rows[row]) {
            let newLetter = document.createElement("button");
            newLetter.id = (letterIDPrefix + rows[row][letter]);
            newLetter.addEventListener("click", () => addLetter(rows[row][letter]));
            newLetter.innerHTML = rows[row][letter];
            newLetter.addEventListener('animationend', () => {
                newLetter.style.animation = 'none'; });

            newRow.append(newLetter);
        }

        if(row == "3") {
            delKey = document.createElement("button");
            delKey.addEventListener("click", () => removeLetter(true));
            delKey.innerHTML = "del";
            delKey.id = "delKey";

            delKey.addEventListener('animationend', () => {
                delKey.style.animation = 'none'; });
            
            newRow.append(delKey);
        }

        keyboard.append(newRow);
    }
}

// Refocus the window to a guess box using the given index
function guessBoxFocus(index) {
    // If within the guess box area,
    if(index < wordSize && index >= 0) {
        // Update current letter to the set index
        currentLetter = index;
        
        // Focus on the specified letter box
        let focusElm = document.getElementById("letter" + index);
        focusElm.focus();

        // TESTING: Snappy animation to show focus
        // BUG: Because of event, doesn't reaapply?
        focusElm.style.animation = "PopIn .25s linear alternate";

        // Move the cursor to the end of the box
        focusElm.setSelectionRange(1, 1);
    }
    // Outside guessbox area
    else {
        console.log("Not in textbox range");
        // Move the cursor/focus depending on the gamestate
        if(isGameOver()) {
            console.log("Can now reset");

            // Navigate to the "Play Again" button
            playAgainButton.focus();
        }
        else {
            // Navigate to the "Submit Guess" button
            guessButton.focus();
        }
    }

    // DEBUG
    //console.log("focus " + currentLetter);
}

// Clear the value of a guess box using the given index
function clearGuessBox(index) {
    let currentElm = document.getElementById("letter" + index);
    // Clear the value
    currentElm.value = "";
}

// Add letter to the current guess box
function addLetter(letter) {
    //console.log("adding letter " + letter + " to slot " + currentLetter);

    // If within the guess box area,
    if(currentLetter < wordSize && currentLetter >= 0) {
        // Replace the HTML element's value with the given letter
        let currentElm = document.getElementById("letter" + currentLetter);
        currentElm.value = letter;

        // Move to the next element, -1 if out of bounds
        currentLetter++;
        if(currentLetter >= wordSize) {
            currentLetter = -1
        }

        currentElm.style.animation = "jump .25s linear";

        let keyboardKey = document.getElementById("keyboard-letter-" + letter);
        keyboardKey.style.animation = "pulse .5s linear";

        // Focus on next element
        guessBoxFocus(currentLetter);
    }
    // Cannot enter any more letters
    else {
        //console.log("Guess is full");
    }
}

// Remove the current value in the guess box and navigate backwards
function removeLetter(moveBackwards) {
    // If within the guess box range,
    if(currentLetter >= 0 && currentLetter < wordSize) {
        delKey.style.animation = "pulse .5s linear";
        clearGuessBox(currentLetter);
    }

    // Move backwards if not already at 0 (and moving backwards allowed)
    if(moveBackwards && currentLetter > 0) {   
        guessBoxFocus(currentLetter -1);
    }

}

// Handles movement between guess boxes and input validation
function handleInput(event) {
    // Handle event's key (ignoring default)
    event.preventDefault();
    switch(event.key) {
        // Deletion
        case "Backspace": removeLetter(true); break;
        case "Delete": removeLetter(false); break;

        // Movement
        case "ArrowLeft": if(currentLetter > 0) { guessBoxFocus(currentLetter -1); } break;
        case "Tab":
        case "ArrowRight": guessBoxFocus(currentLetter +1); break;

        // Other keys
        default:
            let key = event.key

            // Any keys a-z can be added to the guess area
            if(/^[a-z]$/i.test(key)) {
                addLetter(key.toLowerCase())
            }
            break;
    }
}

// Reset the game
function reset() {
    // Reset the game and the number of tries
    solved = false;
    tryNum = 0;

    // Don't allow the user to find the word using inspect lol
    guessWord.innerHTML = "";
    revealWord.innerHTML = "";

    // Hide any messages to the user
    toggleShow(invalidMsg, false);
    toggleShow(sovledMsg, false);
    toggleShow(failedMsg, false);

    // Re-enable text entry, focusing on the first input box
    Array.from(wordleContainer.children, childElement => { childElement.disabled = false; });
    guessBoxFocus(0);

    // Reset keyboard letter styling and disable state
    Array.from(keyboard.children, row => { Array.from(row.children).forEach(key => { key.className = ""; key.disabled = false; } )});
}

// Restart the game with a new word, erasing previous guesses
function restart() {
    reset();

    // Clear all previous guesses
    Array.from(tries)
    for (let i = 0; i < tries; i++) {
        triesContainer.children[i].innerHTML = "";
    }

    // Clear the guessing area
    for (let i = 0; i < wordSize; i++) {
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
    for (let i = 0; i < wordSize; i++) {
        let letter = wordleContainer.children[i].value

        // Quick exit for incomplete sumbission
        if(letter == ' ' || letter == '') {
            return false;
        }

        inputWord += letter;
    }

    // Must be in the word list
    let valid = wordList.includes(inputWord);
    return valid;
}

// Add "valid" class to guessButton if the user's guess is in the wordlist
function validateGuess() {
    if (validateInput()) {
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
    for (let i = 0; i < wordSize; i++) {
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
    if (!isGameOver()) {
        // If the user submitted a valid word,
        if (validateInput()) {
            // Hide the "invalid guess" message
            toggleShow(invalidMsg, false);

            // Filling in the current try section,
            let currentTry = triesContainer.children[tryNum];
            let correctLetters = 0;

            // For each letter in the guess,
            for (let i = 0; i < wordSize; i++) {
                // Create a div to show each letter's grade
                let newLetter = document.createElement("div");
                newLetter.classList.add("letter");

                // Get a letter from the user's guess
                let letter = guess[i];
                newLetter.innerHTML = letter;

                // Grade the letter (red - not in word, yellow - in word, but wrong spot, green - correct spot) 
                let grade = "incorrect";
                if (letter != "" && letter != " ") {
                    if (word[i] == letter) {
                        grade = "correct";
                        correctLetters++;
                    }
                    else if (word.includes(letter)) {
                        grade = "wrong-location";
                    }
                }
                // Add the grade as a class to display the appropriate CSS
                // Add class to animate each guess
                newLetter.classList.add(grade);

                newLetter.style.animation = "spin-in .75s linear";

                // Update the keyboard
                // Disable any letters that aren't in the word
                let keyboardLetter = document.getElementById("keyboard-letter-" + letter)
                if(grade == "incorrect") {
                    keyboardLetter.disabled = true;
                }
                
                // Add CSS styling
                if(!keyboardLetter.classList.contains(grade)) {
                    keyboardLetter.classList.add(grade);
                }

                // Add the element to the DOM
                currentTry.append(newLetter);

                // Clean up the guess box as we go
                clearGuessBox(i);
            }

            // The user uses up a try
            tryNum++;

            // TODO [CLEANUP]: Change return of isGameOver?
            // If the word was correctly guessed or the game is over,
            if (correctLetters == wordSize || isGameOver()) {
                
                // Determie how the user did
                let message = "none";
                if(correctLetters == wordSize) {
                    solved = true; // The user solved the game
                    message = sovledMsg
                }
                else {
                    // Reveal the word to the user
                    revealWord.innerHTML = word;
                    message = failedMsg
                }
                // Tell the user how they did
                toggleShow(message, true);

                // Disable click on text box     
                Array.from(wordleContainer.children, childElement => { childElement.disabled = true; });
                
                // Focus on the reset button
                playAgainButton.focus();

                // Since currentLetter = max, the keyboard is already disabled
            }
            // Otherwise the game is not over
            else {
                // Reset cursor focus
                guessBoxFocus(0);
            }

        } else {
            // Tell the user their word isn't in the word list
            toggleShow(invalidMsg, true);
        }
    }
    // Otherwise, game is over
}

// Show/hides the given HTML element
function toggleShow(item, visible) {
    if (visible) {
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
    guessButton.addEventListener("keydown", function (event) {
        // Handle event's key (ignoring default)
        event.preventDefault();
        switch(event.key) {
            case "ArrowLeft":
            case "Backspace":
                guessBoxFocus(wordSize -1);
                break;
            case "Enter":
                gradeInput();
                break;
            default:
                break;
        }
    })

    // Allows the user to restart their game using the same wordlist
    let restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", restart);

    // Allows the user to restart their game using a randomly selected wordlist
    let restartRandomButton = document.getElementById("restart-random");
    restartRandomButton.addEventListener("click", restartRandom);

    // Refocus the user's cursor (only works for moving between tabs/windows (doesn't work for clicking on the window))
    window.addEventListener('focus', () => guessBoxFocus(currentLetter));

    // Focus on the first text box when the page loads
    document.addEventListener('DOMContentLoaded', () => guessBoxFocus(currentLetter));

    // Prevent the default focus behavior
    document.addEventListener('mousedown', function(event) { event.preventDefault(); guessBoxFocus(currentLetter); });
}