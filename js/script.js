// Tic tac toe HTMLElements
const btnRestart = document.querySelector("button");
const tds = document.querySelectorAll("td");
const playerPointsLabel = document.querySelector(".player");
const IAPointsLabel = document.querySelector(".ai");

// The winning / tie message HTMLElements
const winDiv = document.getElementById("#winDiv");
const closeButton = document.querySelector(".close");
const popupP = document.querySelector(".popup p");

// Set by default the actual caracter to X (the player), so the player will start to play
let actualCharacter = "X";

let ticTacToe = ["", "", "", "", "", "", "", "", ""];
let winner = null;
let tie = false;
let playerPoints = 0;
let IAPoints = 0;

const winningPatterns = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // [\] Diagonal
  [2, 4, 6], // [/] Diagonal
];

/**
 * Puts an O to an case (in parameter)
 *
 * @param {HTMLElement} td
 */
function placeO(td) {
  td.innerHTML = "<p>O</p>";
}

/**
 * Puts an X to an case (in parameter)
 *
 * @param {HTMLElement} td
 */
function placeX(td) {
  td.innerHTML = "<p>X</p>";
}

function handlePlayerClick(td) {
  // change the value in the plate variable
  ticTacToe[td.id] = actualCharacter;

  // Put a cross or a circle and change the actual character
  actualCharacter === "X" ? placeX(td) : placeO(td);
  actualCharacter = actualCharacter === "X" ? "O" : "X";
}

// Do what it have to do when an case is clicked
tds.forEach((td) =>
  td.addEventListener("click", (e) => {
    if (!e.target.innerHTML && !winner) {
      // Do what the user asked for by clicking
      handlePlayerClick(e.target);

      // Let's look if the user won with his move
      verifyWin();

      if (actualCharacter === "O") {
        if (!winner) {
          // It's the AI turn but only if the user didn't win
          IAPlay();
        }

        // Now we have to look if our ia won !
        verifyWin();
      }
    }
  })
);

function verifyWin() {
  let winnerPattern = null;
  winnerPattern = winningPatterns.filter(
    (pattern) =>
      // If all the elements in the pattern are equals to "X"
      pattern.every((index) => ticTacToe[index] === "X") ||
      // Or if all the elements in the pattern are equals to O
      pattern.every((index) => ticTacToe[index] === "O")
  )[0];

  // If there is a pattern with a single signe, so get this signe and it's the winner
  if (winnerPattern) {
    winner = document.getElementById(winnerPattern[0])?.textContent;

    // Make the winner win
    if (winner === "X") {
      winner = "The player";
      playerPoints++;
      playerPointsLabel.textContent = "Player: " + playerPoints;
    } else {
      winner = "The AI";
      IAPoints++;
      IAPointsLabel.textContent = "IA: " + IAPoints;
    }
    alert(winner + " Won");
    reset();
  } else {
    // Look if it's tie (elements is useless but it doesn't roll if i don't put it)
    tie = ticTacToe.every((element) => {
      // They all need to be "X" or "O"
      return element !== "";
    });

    // If there is a tie, end the game and alert
    if (tie) {
      alert("It's a tie !");
      reset();
    }
  }
}

function reset() {
  tds.forEach((td) => (td.innerHTML = ""));
  ticTacToe.fill("");
  winner = null;
  actualCharacter = "X";
}

function TwoElementsAreInPatterns(character, pattern) {
  const numberCharsInPattern = pattern.filter(
    (index) => ticTacToe[index] === character
  ).length;
  return numberCharsInPattern === 2;
}

function getTheEmptyElementInPattern(pattern) {
  const elementId = pattern.filter((index) => ticTacToe[index] === "");
  return document.getElementById(elementId);
}

/**
 * Used to place in the tic tac toe an circle if the user or the IA id about to win (O if IA is about to win and X if player is about to win)
 *
 * @param {string} character
 */
function placeIfCan(character) {
  let clicked = false;

  // Look for every winning pattern
  for (const winningPattern of winningPatterns) {
    // If the 2 same elements are in one winning pattern, it means that the player or the IA is about to win
    if (TwoElementsAreInPatterns(character, winningPattern)) {
      // So the ia will try to block the player or to win by finishing the line / column / diagonal
      const caseToClick = getTheEmptyElementInPattern(winningPattern);

      // caseToClick can be null because of line can be like [X] [X] [O] (nowhere to click even if there are 2X)
      if (caseToClick?.textContent === "") {
        caseToClick.click();

        // The right button has been pressed, we can now exit and return further the state of true for clicked
        clicked = true;
        break;
      }
    }
  }

  return clicked;
}

/**
 * Let the ia play
 */
function IAPlay() {
  // SetTimeout to make the time-reaction of the ia (makes it looks like more like an human)
  setTimeout(() => {
    let played = false;

    // Place an circle to win if the IA is about to win
    played = placeIfCan("O");

    if (!played) {
      // Same thing but if the player is about to win
      played = placeIfCan("X");
    }

    if (!played) {
      // If the ia didn't play, so play an random move
      let randomIndex = -1;

      // generate an random index until the case with the index
      while (ticTacToe[randomIndex] !== "") {
        randomIndex = Math.floor(Math.random() * 9);
      }

      const caseToClick = document.getElementById(randomIndex);
      caseToClick.click();
    }
  }, Math.random() * 500 + 500);
}
