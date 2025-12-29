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

// ** Variables ** //

// Names of Scorecard categories
const SCORECARD_GROUP_TYPES = ["Type", "of a kind", "Mixed", "Free roll", "Run of"];
const DIE_FACES = {"One" : 1, "Two" : 2, "Three": 3, "Four": 4, "Five" : 5, "Six" : 6}; // Value names to point value
const DIE_FACE_NAMES = Object.keys(DIE_FACES);

// Used to separate Scorcard type and Die Face type
const KEY_SEPARATOR = '_';

// Class names used for CSS styling
const DISABLED_DIE_CSS = "disabled";
const SCORECARD_CELL_CSS = "scorecardCell";
const SCORECARD_CELL_TITLE_CSS = "cell-name";
const SCORECARD_CELL_SCORE_CSS = "cell-score";
const SCORECARD_CELL_SCORE_HIDDEN_CSS = "hidden";

// Determines styling of all board items
const CSS_THEME = "die"; //"card";

const MAX_ROLLS = 3; // Total number of rolls a player can take in a round
const NUM_DICE = 5; // TODO [FEATURE]: Allow user to determine number of die used before playing

let totalScore = 0; // The user's current total score
let rollsLeft = MAX_ROLLS; // The number of rolls the player can do in the round

// Setup the page
setup();

// ** Functions ** //

// Setup all HTML elements
function setup() {
    // Setup the scorecards
    setupScorecards();

    // Setup the dice
    for(let i = 0; i < NUM_DICE; i++) {
        let newDie = document.createElement("button");
        newDie.classList.add(CSS_THEME);

        newDie.addEventListener("click", () => { toggleDieDisable(newDie) });
        boardElement.appendChild(newDie);
    }

    // Setup the buttons
    rollButton.addEventListener("click", () => { rollAll() });
    resetButton.addEventListener("click", () => { restart() });

    // Restart all values
    restart();
}

// Setup the scorecard HTML elements
function setupScorecards() {
    // Get specific DieFace type
    // Scoring: Sum only the specified face's value
    for(let dieFaces of DIE_FACE_NAMES) {
        let name = dieFaces + "s";
        
        // Temp fix for plural Six -> Sixes
        if(dieFaces == "Six") {
            name = "Sixes";
        }

        createScorecard(SCORECARD_GROUP_TYPES[0] + KEY_SEPARATOR + dieFaces, name);
    }

    // Get i of a kind (3+)
    for(let i = 3; i < NUM_DICE; i++) {
        createScorecard(SCORECARD_GROUP_TYPES[1] + KEY_SEPARATOR + i, i + " " + SCORECARD_GROUP_TYPES[1]);
    }

    // Yahtzee - Get all the same (50pts)
    createScorecard(SCORECARD_GROUP_TYPES[1] + KEY_SEPARATOR + NUM_DICE, "Yahtzee");

    // Mixed/Full House?
    createScorecard(SCORECARD_GROUP_TYPES[2], SCORECARD_GROUP_TYPES[2]);

    // Free roll
    createScorecard(SCORECARD_GROUP_TYPES[3], SCORECARD_GROUP_TYPES[3]);

    // Get run of i (4+)
    for(let i = 4; i < NUM_DICE + 1; i++) {
        createScorecard(SCORECARD_GROUP_TYPES[4] + KEY_SEPARATOR + i, SCORECARD_GROUP_TYPES[4] + " " + i);
    }
}

// Calculate the score for the given scorecardGroup
function calculatePoints(scorecardGroup, dieFaces) {
	let points = 0;
	let scorecardType = scorecardGroup.split(KEY_SEPARATOR); // Name + value
    let valuesExist = new Set(Array.from(dieFaces).sort((a, b) => getDieValue(a) - getDieValue(b))); // Get sorted set of unique values (based on point value)

	switch(scorecardType[0]) {
        // Get specific Type of DieFace
		case SCORECARD_GROUP_TYPES[0]:
            // Count specified die face
            let goalFace = scorecardType[1]; // Value = dieFace
            let numValues = getCount(dieFaces, goalFace);
            points = (getCount == NUM_DICE) ?  50 :  DIE_FACES[goalFace] * numValues;
			break;
		
        // Get # of a Kind
		case SCORECARD_GROUP_TYPES[1]:
            let countNeeded = scorecardType[1]; // Value = integer number needed
            if(countNeeded <= getMostCommonCount(dieFaces)) {
                for (let i = 0; i < dieFaces.length; i++) {
                    points += getDieValue(dieFaces[i]);
                }
            }
            break;
        
        // Get a variety of DieFaces, mixed
		case SCORECARD_GROUP_TYPES[2]:
            // If all values are different (nothing removed) or all unique values in DIE_FACES exist
            if(valuesExist.size == NUM_DICE || valuesExist.size == DIE_FACES.length) {
                for (let i = 0; i < dieFaces.length; i++) {
                    points += getDieValue(dieFaces[i]);
                }
            }
            break;
		
        // Free Roll
        case SCORECARD_GROUP_TYPES[3]:
            // Add up all point values
            for (let i = 0; i < dieFaces.length; i++) {
                points += getDieValue(dieFaces[i]);
            }
            break;

        // Get # in a row, sequence
        case SCORECARD_GROUP_TYPES[4]:
            let runSize = parseInt(scorecardType[1]);

            // Unique items in a run,
            if(valuesExist.size >= runSize) {
                // Start at the index of the first value of DIE_FACES
                let startingIndex = DIE_FACE_NAMES.indexOf([...valuesExist][0]);
                let nextCheckIndex = startingIndex;
                let interrupted = false;
                //console.log(valuesExist);
                //console.log("Starting at Face index: " + startingIndex + ", " + [...valuesExist][0]);

                // For every item in the valuesExist set,
                for(let i = 0; i < valuesExist.size; i++) {
                    // If an interruption has occurred,
                    if(interrupted) {
                        // Start over
                        startingIndex = DIE_FACE_NAMES.indexOf([...valuesExist][i]);
                        nextCheckIndex = startingIndex;
                        interrupted = false;
                        //console.log("Starting over at " + DIE_FACE_NAMES[nextCheckIndex] + ", " + i);
                    }
                    
                    // If the values do not match, the run has been interrupted
                    if(DIE_FACE_NAMES[nextCheckIndex] != [...valuesExist][i]) {
                        interrupted = true;
                        //console.log("Run interrupted! " + DIE_FACE_NAMES[nextCheckIndex] + " vs " + [...valuesExist][i]);
                    }
                    nextCheckIndex++; // Move to next index in DIE_FACES

                    // If valid startingIndex of uninterrupted values,
                    if(!interrupted && nextCheckIndex - startingIndex >= runSize) {
                        //console.log("Break out, success for run of " + runSize);
                        points = runSize * 10;
                        break;
                    }
                }
            }
            break;
        
        // Invalid ScorecardGroup
		default:
			console.error("Invalid scorecard group \"" + scorecardType[0] + "\" " + scorecardType);
		    break;
	}

    return points;
}

// Return the count of the most common item in dieValues
function getMostCommonCount(dieValues) {
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
			}
		}
		// Reset the current item's frequency for the next iteration
		m = 0;
	}
	// Return highest count of items
	return mf;
}

// Restart the Game
function restart() {
    reset();

    // Reset the score to 0
    totalScore = 0;
    totalScoreElement.innerHTML = totalScore;

    // Restart all Scorecards
    for(let i = 0; i < scorecardElement.children.length; i++) {
        let cell = scorecardElement.children[i];

        // Re-enable and set score to '0';
        cell.disabled = false;
        cell.children[1].innerHTML = "0";
    }
}

// Roll a specific Die
function roll(dieElement) {
	// TODO [EXTRA]: Add roll animation
	
	// Update the die's value
    let newValue = getRandomValue(DIE_FACE_NAMES.length);
	dieElement.value = DIE_FACE_NAMES[newValue];
    dieElement.classList = CSS_THEME + DIE_FACE_NAMES[newValue];

	// TODO [EXTRA]: Change class from ONE - SIX to display die face
	dieElement.innerHTML = newValue + 1
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
            let scoreName = scoreCell.children[0];
            let score = scoreCell.children[1]; // The score div
            let newScore = calculatePoints(scoreName.value, dieValues);
            score.innerHTML = newScore;
        }
    }
}

// TODO [EXTRA]: Disable scorecard :hover when rolls = Max
// End the current round of the game
function endRound(selectedCell, score) {
    // Only end round when there are rolled die
    if(rollsLeft == MAX_ROLLS) {
        return;
    }

    // Update the total score
    totalScore += parseInt(score.innerHTML);
    totalScoreElement.innerHTML = totalScore;

    // Disable selected scorecard cell
    selectedCell.disabled = true;

    // Move to next round
    rollsLeft = MAX_ROLLS;
    reset();
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

// Create a Scorecard in the HTML
function createScorecard(key, name) {
    let newScoreCell = document.createElement("button");
    newScoreCell.classList.add(SCORECARD_CELL_CSS);

    let title = document.createElement("div");
    title.classList.add(SCORECARD_CELL_TITLE_CSS);
    title.value = key;
    title.innerHTML = name;

    let score = document.createElement("div");
    score.classList.add(SCORECARD_CELL_SCORE_CSS);
    score.classList.add(SCORECARD_CELL_SCORE_HIDDEN_CSS);
    score.innerHTML = "0";

    newScoreCell.appendChild(title);
    newScoreCell.appendChild(score);

    newScoreCell.addEventListener("click", () => { endRound(newScoreCell, score) });
    scorecardElement.appendChild(newScoreCell);
}

// Given an HTML element, toggle the DISABLED_DIE_CSS class
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

// Get the point value of the given dieFace
function getDieValue(dieFaceName) {
    return DIE_FACES[dieFaceName];
}

// Get the number of die in dieValues that match the dieFace
function getCount(dieValues, dieFace) {
	return dieValues.filter((die) => die == dieFace).length;
}

// Get the values from each item in boardElement
function getDieValues() {
	let dieValues = [];
    for(let i = 0; i < boardElement.children.length; i++) {
        let die = boardElement.children[i]
		dieValues.push(die.value);
	}
	return dieValues;
}

// Get a value between 0 and max (exclusive)
function getRandomValue(max) {
	return Math.floor(Math.random() * max)
}