const btnRecommencer = document.querySelector("button")
const tds = document.querySelectorAll("td")
const winDiv = document.getElementById("#winDiv")
const closeButton = document.querySelector(".close")
const playerPointsLabel = document.querySelector(".player")
const IAPointsLabel = document.querySelector(".ai")

let actualCharacter = "X"

let plate = ["", "", "", "", "", "", "", "", ""];
let winner = null;
let tie = false;
let playerPoints = 0;
let IAPoints = 0;

const winningPatterns = [
  [0, 1, 2], // Ligne du haut
  [3, 4, 5], // Ligne du milieu
  [6, 7, 8], // Ligne du bas
  [0, 3, 6], // Colonne de gauche
  [1, 4, 7], // Colonne du milieu
  [2, 5, 8], // Colonne de droite
  [0, 4, 8], // Diagonale de haut gauche à bas droite
  [2, 4, 6], // Diagonale de haut droite à bas gauche
];

function setO(td) {
  td.innerHTML = "<p>O</p>";
  td.color = "red";
}

function setX(td) {
  td.innerHTML = "<p>X</p>";
  td.color = "green";
}

function handleTdClick(td) {
  plate[td.id] = actualCharacter
  actualCharacter === "X" ? setX(td) : setO(td);
  actualCharacter = actualCharacter === "X" ? "O" : "X"
  console.log(actualCharacter)
}

tds.forEach((td) =>
  td.addEventListener("click", (e) => {
    if (!e.target.innerHTML && !winner) {
      // Do what the user asked for by clicking
      handleTdClick(e.target);

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
  try {
    winnerPattern = winningPatterns.filter(pattern =>
      // If all the elements in the pattern are equals to "X"
      pattern.every(
        (index) =>
          plate[index] === "X"
      )

      // Or if all the elements in the pattern are equals to O
      || pattern.every(
        (index) =>
          plate[index] === "O"
      )
    )[0]
  }
  catch {
    console.log("No winner")
  }

  // If there is a pattern with a single signe, so get this signe and it's the winner
  if (winnerPattern) {
    winner = document.getElementById(winnerPattern[0])?.textContent;
  }
  else {
    // Look if it's tie (elements is useless but it doesn't roll if i don't put it)
    tie = plate.every(elements => {
      // They all need to be "X" or "O"
      for (let i = 0; i < plate.length - 1; i++) {

        // If one case is empty, it's not tie
        if (document.getElementById(i).textContent === "")
          return false;
      }

      // Case if no cases are empty and there are no winner
      return true;
    })
  }

  if (winner) {
    if (winner === "X") {
      winner = "The player"
      playerPoints++
      playerPointsLabel.textContent = "Player: " + playerPoints
    }
    else {
      winner = "The AI"
      IAPoints++
      IAPointsLabel.textContent = "IA: " + IAPoints
    }
    alert(winner + " Won")
    reset()
  }
  else if (tie) {
    alert("It's a tie !")
    reset()
  }
}

function reset() {
  tds.forEach((td) => (td.innerHTML = ""));
  plate.fill("");
  winner = null;
  actualCharacter = "X"
}

function TwoElementsAreInPatterns(character, pattern) {
  const numberCharsInPattern = pattern.filter((index) => plate[index] === character).length
  return numberCharsInPattern === 2
}

function getTheEmptyElementInPattern(pattern) {
  const elementId = pattern.filter(index => plate[index] === "")
  return document.getElementById(elementId)
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
      const caseToClick = getTheEmptyElementInPattern(winningPattern)

      // caseToClick can be null beacause of line like X X O (nowhere to click)
      if (caseToClick?.textContent === "") {
        caseToClick.click()
        clicked = true
        break;
      }

      // set clicked at true because the ia played and don't have to play anymore
    }
  }

  return clicked
}

function IAPlay() {
  setTimeout(() => {
    let played = false;

    // Place an circle to win if the IA is about to win
    played = placeIfCan("O")

    if (!played) {
      // Same thing but if the player is about to win
      played = placeIfCan("X")
    }

    if (!played) {
      // If the ia didn't play, so play an random move
      let randomIndex = 0;

      // generate an random index until the case with the index
      while (plate[randomIndex] !== "") {
        randomIndex = Math.floor(Math.random() * 9)
      }

      const caseToClick = document.getElementById(randomIndex);
      caseToClick.click()
    }
    console.log(plate)
  }, Math.random() * 500 + 500);
}