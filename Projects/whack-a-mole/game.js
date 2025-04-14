// wati
document.addEventListener("DOMContentLoaded", () => {

    /****************************
    ** Variables
     ****************************/

    /** CONST **/
    // Value for the length of the game
    const GAME_LENGTH = 10000;
    // Value for the min time that a mole can be up
    const MIN_UP = 500;
    // Value for the max time that a mole can be up
    const MAX_UP = 1000;

    // Select all the holes for the game
    const holes = document.querySelectorAll('[class^="hole"]');

    // Select all the moles in the game
    const [...moles] = document.querySelectorAll('.mole');

    // Select the scoreboard
    const scoreboard = document.querySelector('.score');


    /** LET **/
    // A place to store which hole a mole appeared from last
    let lastHole = null;
    // Initial value for the question: Is the game over?
    let gameOver = true;
    // Set the initial score
    let score = 0;

    /****************************
     ** Functions
     ****************************/
    // Set up and start the game
    const startGame = () => {
        // Set the game to not be over
        gameOver = false;
        // Reset the score
        score = 0;
        // Reset the scoreboard display
        scoreboard.textContent = score;
        // Command the moles to begin popping
        molePop();

        // Set the game time for when it should be over
        setTimeout(
            () => { gameOver = true; },
            GAME_LENGTH
        );
    };

    // select a random hole for a mole to pop up
    const randomHole = () => {
        // Randomly select a number between 1 and the total number of holes
        const selection = randomNum(0, (holes.length - 1));
        // Use the number to select a hole
        const hole = holes[selection];
        // If the selected mole is the same as the last one, pick again
        if (hole === lastHole) {
            return randomHole();
        }

        // Set the value of the selected hole
        lastHole = hole;
        // Return the selected hole to where it came from
        return hole;

    };

    // get a random amount of time for molde to be up, etc
    const randomNum = (min, max) => Math.round(Math.random() * (max - min) + min);

    // 'Pop' up a mole
    const molePop = () => {
        // Get a random mamount of tme between your min and max time
        const upTime = randomNum(MIN_UP, MAX_UP);
        // select a random hole
        const selectedHole = randomHole();
        // pop the mole up
        selectedHole.classList.add('up');

        // return the mole below ground
        setTimeout(
            () => {
                selectedHole.classList.remove('up');
                // if the game is not over, pop again
                if (!(gameOver)) {
                    return molePop();
                }
            },
            upTime
        );
    };

    // record when you 'bonk' a mole and score points
    const moleBonk = (e) => {
        // increase score
        score++;
        // update score board
        scoreboard.textContent = score;
        // Mole goes back into the hole
        e.currentTarget.parentNode.classList.remove('up');
    };

    /****************************
     ** Event Handling
     ****************************/
    // Watch for the click of the start button
    document.querySelector('button').addEventListener('click', startGame);

    // Watch for the clicking on each of the moles
    moles.forEach(
        (mole) => {
            mole.addEventListener('click', moleBonk);
        }
    );
}
);