// ** HTML Elements ** //
// The Yahtzee scorecard container
let scorecardElement = document.getElementById("scorecard");

// Board/Game Area
let boardElement = document.getElementById("board");

// Display for game information
let gameInfoElement = document.getElementById("gameInfo");

// Where the total score value is displayed
let totalScoreElement = document.getElementById("totalScore");

// Buttons
let rollButton = document.getElementById("roll");
let resetButton = document.getElementById("restart");

const DIE_FACES_CSS = ["die_one", "die_two", "die_three", "die_four", "die_five", "die_six"]; // CSS classes used to display current die face
const DIE_FACES = {"die_one" : 1, "die_two" : 2, "die_three": 3, "die_four": 4, "die_five" : 5, "die_six" : 6}; // name to point value
const DIE_SIDES = DIE_FACES_CSS.length;

const KEY_SEPARATOR = '_';

// Class names used for CSS styling
const DISABLED_DIE_CSS = "disabled";
const SCORECARD_CELL_CSS = "scorecardCell";
const SCORECARD_CELL_TITLE_CSS = "cell-name";
const SCORECARD_CELL_SCORE_CSS = "cell-score";
const SCORECARD_CELL_SCORE_HIDDEN_CSS = "hidden";

const SCORECARD_GROUP_TYPES = ["type", "of a kind"]; // # of type, # of a kind

// ** Game variables ** //
const MAX_ROLLS = 3; // Total number of rolls a player can take in a round
const NUM_DICE = 5;

// Setup the scorecards

// Get speicific Die Face type
for(let dieFaces of DIE_FACES_CSS) {
    createScorecard(dieFaces + "s", SCORECARD_GROUP_TYPES[0] + KEY_SEPARATOR + dieFaces);
}

// Get # of a kind
for(let i = 1; i < NUM_DICE + 1; i++) {
    createScorecard(i + " " + SCORECARD_GROUP_TYPES[1], SCORECARD_GROUP_TYPES[1] + KEY_SEPARATOR + i);
}

function createScorecard(key, name) {
    let newScoreCell = document.createElement("button");
    newScoreCell.classList.add(SCORECARD_CELL_CSS);

    let title = document.createElement("div");
    title.classList.add(SCORECARD_CELL_TITLE_CSS);
    title.innerHTML = key;
    title.value = name;

    let score = document.createElement("div");
    score.classList.add(SCORECARD_CELL_SCORE_CSS);
    score.classList.add(SCORECARD_CELL_SCORE_HIDDEN_CSS);
    score.innerHTML = "0";

    newScoreCell.appendChild(title);
    newScoreCell.appendChild(score);

    newScoreCell.addEventListener("click", () => { addScore(newScoreCell, score) });
    scorecardElement.appendChild(newScoreCell);
}

// Setup the dice
for(let i = 0; i < NUM_DICE; i++) {
    let newDie = document.createElement("button");
    newDie.classList.add("die");

    newDie.addEventListener("click", () => { toggleDieDisable(newDie) });
    boardElement.appendChild(newDie);
}

// Setup the buttons
rollButton.addEventListener("click", () => { rollAll() });
resetButton.addEventListener("click", () => { restart() });

let totalScore = 0;
let rollsLeft = MAX_ROLLS;

// Restart the values of the game
restart()

function getDieValues() {
	let dieValues = [];
    for(let i = 0; i < boardElement.children.length; i++) {
        let die = boardElement.children[i]
		dieValues.push(die.value);
	}
	return dieValues;
}

function calculatePoints(scorecardGroup, dieValues) {	
	let points = 0;

    
	let scorecardType = scorecardGroup.split(KEY_SEPARATOR);
    let dieFace = scorecardType[1] + KEY_SEPARATOR + scorecardType[2];
	
	switch(scorecardType[0]) {
		case SCORECARD_GROUP_TYPES[0]:
			// Count specified die face
			points = DIE_FACES[dieFace] * getCount(dieValues, dieFace);
			break;
		
		case SCORECARD_GROUP_TYPES[1]:
			// If there are any faces where count > specified count, award points
			let countNeeded = DIE_FACES[dieFace];
            let mostCommon = getMostCommonCount(dieValues, countNeeded)
			points = mostCommon != null ? DIE_FACES[mostCommon] * countNeeded : 0;
			break;
		
		case SCORECARD_GROUP_TYPES[2]:
			break;
		default:
			console.error("Invalid scorecard group");
		break;
	}

    return points;
}

function getCount(dieValues, dieFace) {
	return dieValues.filter((die) => die == dieFace).length;
}

function getMostCommonCount(dieValues, countNeeded) {
	// TODO [FEATURE]: Modify to return true if countNeeded met
    // TODO [FEATURE]: Modify to return item with highest value
	// Initialize variables to track the most frequent item, its frequency, and the current item's frequency
	var mf = 1;
	var m = 0;
	var item;

	// Iterate through the array to find the most frequent item
	for (var i = 0; i < dieValues.length; i++) {
		// Nested loop to compare the current item with others in the array
		for (var j = i; j < dieValues.length; j++) {
			// Check if the current item matches with another item in the array
			if (dieValues[i] == dieValues[j])
				m++;
			// Update the most frequent item and its frequency if the current item's frequency is higher
			if (mf < m) {
				mf = m;
				item = dieValues[i];
				if(mf >= countNeeded) {
					return item;
				}
			}
		}
		// Reset the current item's frequency for the next iteration
		m = 0;
	}
	// countNeeded wasn't met
	return null;
}

// Restart the Game
function restart() {
    reset();

    totalScore = 0;
    totalScoreElement.innerHTML = totalScore;

    // TODO: Restart all Scorecards
    for(let i = 0; i < scorecardElement.children.length; i++) {
        let cell = scorecardElement.children[i]
        cell.disabled = false;
        cell.children[1].innerHTML = "0";
    }
}

// Reset the Board for a new round
function reset() {
    // Reset rolls
    rollsLeft = MAX_ROLLS
    rollButton.disabled = false

    // For all die,
    for(let i = 0; i < boardElement.children.length; i++) {
        let die = boardElement.children[i]

        die.innerHTML = " ";
        die.value = " ";

        if(die.classList.contains(DISABLED_DIE_CSS)) {
            die.classList.remove(DISABLED_DIE_CSS)
        }
    }
}

// Roll all Die that aren't frozen/locked
function rollAll() {
    // ERROR HANDLING: Catch if out of rolls
	if(rollsLeft <= 0) {
		console.log("Out of rolls");
		return;
	}

    // Decrease number of rolls, disable button if out of rolls
	rollsLeft--;
    if(rollsLeft == 0) {
        rollButton.disabled = true;
    }
	

	// Roll all die that aren't disabled, collecting the values
    let dieValues = []
    for(let i = 0; i < boardElement.children.length; i++) {
        let die = boardElement.children[i]
		if(!(die.classList.contains(DISABLED_DIE_CSS))) {
			roll(die);
		}
        dieValues.push(die.value)
    }

    // Calculate score for each scorecard Cell, updating score
    for(let i = 0; i < scorecardElement.children.length; i++) {
        let scoreCell = scorecardElement.children[i];
        if(!scoreCell.disabled) {
            let scoreName = scoreCell.children[0]
            let score = scoreCell.children[1]; // The score div
            let newScore = calculatePoints(scoreName.value, dieValues);
            score.innerHTML = newScore;
        }
    }
}

function toggleDieDisable(dieElement) {
    // Only lock when there are rolled die
    if(rollsLeft == MAX_ROLLS) {
        return;
    }

    // Enable Die rolling
    if(dieElement.classList.contains(DISABLED_DIE_CSS)) {
        dieElement.classList.remove(DISABLED_DIE_CSS)
    }
    // Disable
    else {
        dieElement.classList.add(DISABLED_DIE_CSS)
    }
}

// Roll a specific Die
function roll(dieElement) {
	// TODO [EXTRA]: Add roll animation
	
	// Update the die's value
    let newValue = getRandomValue(DIE_SIDES);
	dieElement.value = DIE_FACES_CSS[newValue];

	// [EXTRA] Change class from ONE - SIX to display die face
	dieElement.innerHTML = newValue + 1
}

// Get a value between 0 and max (exclusive)
function getRandomValue(max) {
	return Math.floor(Math.random() * max)
}

function addScore(selectedCell, score) {
    // Only score when there are rolled die
    if(rollsLeft == MAX_ROLLS) {
        return;
    }

    // Disable selected scorecard cell
    totalScore += parseInt(score.innerHTML);
    totalScoreElement.innerHTML = totalScore;
    selectedCell.disabled = true;

    // Move to next round
    rollsLeft = MAX_ROLLS;
    reset();
}