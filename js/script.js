// Tic tac toe HTMLElements
const btnRestart = document.querySelector("button");
const tds = document.querySelectorAll("td");
const XPointsLabel = document.querySelector(".player");
const OPointsLabel = document.querySelector(".ai");
const playAgainstAIcheckbox = document.getElementById("playAgainstAI");
const startCheckbox = document.getElementById("start");
const XTime = document.querySelector(".playerOneTime");
const YTime = document.querySelector(".playerTwoTime");

let iaCaracter = "O";
let playerCaracter = "X";
let XSeconds = 0;
let XCentiSeconds = 0;
let OSeconds = 0;
let OCentiSeconds = 0;

// The winning / tie message HTMLElements
const winDiv = document.getElementById("#winDiv");
const closeButton = document.querySelector(".close");
const popupP = document.querySelector(".popup p");

// Set by default the actual caracter to X (the player), so the player will start to play
let actualCharacter = "X";
let playAgainstAi = false;

let ticTacToe = ["", "", "", "", "", "", "", "", ""];
let winner = null;
let tie = false;
let XPoints = 0;
let OPoints = 0;

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

playAgainstAIcheckbox.addEventListener("click", () => {
  playAgainstAi = !playAgainstAi;
  resetTime();
  if (playAgainstAi && actualCharacter === iaCaracter) IAPlay();

  startCheckbox.disabled = !playAgainstAi;
});

startCheckbox.addEventListener("click", () => {
  iaCaracter = iaCaracter === "X" ? "O" : "X";
  playerCaracter = playerCaracter === "X" ? "O" : "X";
  resetTime();

  if (iaCaracter === "X") {
    IAPlay();
  }
});

/**
 * Puts an O to an case (in parameter)
 *
 * @param {HTMLElement} td
 */
function placeO(td) {
  td.innerHTML = "<p>O</p>";
}

function getEmptyCases(parallelGame) {
  let emptyCases = [];
  parallelGame.forEach((element, index) => {
    element === "" ? emptyCases.push(index) : "";
  });
  return emptyCases;
}

/**
 * Puts an X to an case (in parameter)
 *
 * @param {HTMLElement} td
 */
function placeX(td) {
  td.innerHTML = "<p>X</p>";
}

function handleClick(td) {
  // change the value in the plate variable
  ticTacToe[td.id] = actualCharacter;

  // Put a cross or a circle and change the actual character
  actualCharacter === "X" ? placeX(td) : placeO(td);
  actualCharacter = actualCharacter === "X" ? "O" : "X";

  playAgainstAIcheckbox.disabled = true;
  startCheckbox.disabled = true;
}

// Do what it have to do when an case is clicked
tds.forEach((td) =>
  td.addEventListener("click", (e) => {
    if (!e.target.innerHTML && !winner) {
      // Do what he asked for by clicking
      handleClick(e.target);

      // Let's look if he won with his move
      verifyWin();

      if (actualCharacter === iaCaracter && playAgainstAi) {
        if (!winner) {
          // It's his turn but only if the ither didn't win
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
    if (winner !== iaCaracter) {
      winner = "The player";
      XPoints++;
      XPointsLabel.textContent = "X: " + XPoints;
    } else {
      winner = "The AI";
      OPoints++;
      OPointsLabel.textContent = "O: " + OPoints;
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

  playAgainstAIcheckbox.disabled = false;
  startCheckbox.disabled = false;

  resetTime();
}

function resetTime() {
  XCentiSeconds = 0;
  XSeconds = 0;
  XTime.textContent = "X: 0:00";

  OCentiSeconds = 0;
  OCentiSeconds = 0;
  YTime.textContent = "O: 0:00";
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

function getBestMove() {
  let index = -1;
  let points = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let maxPointsCases = [];

  for (let i = 0; i < 9; i++) {
    winningPatterns.forEach((winningPattern) => {
      if (winningPattern.includes(i)) {
        if (ticTacToe[i] === "") {
          if (
            winningPattern.every((index) => ticTacToe[index] !== playerCaracter)
          )
            points[i]++;
        }
      }
    });
  }

  const maxPoints = Math.max(...points);
  points.forEach((point, index) => {
    if (point === maxPoints) {
      maxPointsCases.push(index);
    }
  });

  if (maxPoints > 0 && maxPointsCases.length === 1) {
    index = points.indexOf(maxPoints);
  } else if (maxPoints > 0 && maxPointsCases.length > 1) {
    return maxPointsCases[Math.floor(Math.random() * maxPointsCases.length)];
  } else {
    index = Math.floor(Math.random() * 10);
    while (ticTacToe[index] !== "") {
      index = Math.floor(Math.random() * 10);
    }
  }

  return index;
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
    played = placeIfCan(iaCaracter);

    if (!played) {
      // Same thing but if the player is about to win
      played = placeIfCan(playerCaracter);
    }

    if (!played) {
      // If the ia didn't play, so play the best move directly
      const bestIndex = getBestMove();

      const caseToClick = document.getElementById(bestIndex);
      caseToClick.click();
    }
  }, Math.random() * 500 + 500);
}

function changePlayerTime(seconds, centiSeconds, playerP) {
  playerP.textContent = `${actualCharacter}: ${seconds}:${centiSeconds}`;
}

setInterval(() => {
  if (actualCharacter === "X") {
    if (XCentiSeconds < 99) {
      XCentiSeconds++;
    } else {
      XCentiSeconds = 0;
      XSeconds++;
    }
    changePlayerTime(XSeconds, XCentiSeconds, XTime);
  } else {
    if (OCentiSeconds < 99) {
      OCentiSeconds++;
    } else {
      OCentiSeconds = 0;
      OSeconds++;
    }
    changePlayerTime(OSeconds, OCentiSeconds, YTime);
  }
}, 10);

function savePoints() {
  localStorage.setItem(
    "points",
    JSON.stringify({
      x: XPoints,
      o: OPoints,
    })
  );
}

function putPointsFromLocalstorage() {
  const points = JSON.parse(localStorage.getItem("points"));

  if (points) {
    XPoints = points.x;
    OPoints = points.o;
  }

  XPointsLabel.textContent = `X: ${XPoints}`;
  OPointsLabel.textContent = `O: ${OPoints}`;
}

window.addEventListener("beforeunload", savePoints);
window.addEventListener("DOMContentLoaded", putPointsFromLocalstorage);

//------------------------------------IA TEST PART------------------------------->
// function IAWin(parallelGame) {
//   return winningPatterns.some((winningPattern) => {
//     winningPattern.every((index) => parallelGame[index] === "O");
//   });
// }

// function PlayerWin(parallelGame) {
//   return winningPatterns.some((winningPattern) => {
//     winningPattern.every((index) => parallelGame[index] === "X");
//   });
// }

// function isParallelGameFull(parallelGame) {
//   return parallelGame.every((element) => element !== "s");
// }

// function iaTests(parallelGame, currentPlayer) {
//   if (IAWin(parallelGame)) return 10;
//   if (PlayerWin(parallelGame)) return -10;
//   if (isParallelGameFull(parallelGame))  {return 0};
//   const emptyCases = getEmptyCases(parallelGame);

//   for (let emptyIndex of emptyCases) {
//     currentPlayer = currentPlayer === "X" ? "O" : "X";
//     parallelGame[emptyIndex] = currentPlayer;
//     return iaTests(parallelGame);
//   }
// }

// function getBestMove() {
//   const parallelGame = [...ticTacToe];
//   const currentPlayer = actualCharacter === "X" ? "O" : "X";
//   const emptyCases = getEmptyCases(parallelGame);
//   let points = [];

//   emptyCases.forEach((emptyIndex) => {
//     parallelGame[emptyIndex] = currentPlayer
//     points.push(iaTests(parallelGame, actualCharacter));
//     parallelGame = ticTacToe
//   });
//   console.log(points)
// }

// getBestMove()
