// Will be updated as users win games, but resets when tab is refreshed
database = [
  {name: "Yessenia", wins: 5},
  {name: "Norman", wins: 4},
  {name: "Emma", wins: 3},
  {name: "Ray", wins: 2},
  {name: "Frederick", wins: 1}
];

// Global variables for the game
var isGameActive = false;
var turnCount = 0;
var playerOne;
var playerTwo;
var activePlayer;
var gridCells;

// Creates the leaderboard using the database's objects and injects it into the document
function makeLeaderboard () {
  var leaderboard = document.createElement("table");
  leaderboard.id = "leaderboard"

  var types = ["rank", "name", "wins"];
  var tableRow;
  var tableCell;
  var textNode;

  for (var i = 0; i < 6; i++){
    tableRow = document.createElement("tr");
    for (var j = 0; j < 3; j++){
      switch (i) {
        case 0:
          tableCell = document.createElement("th");
          var text = types[j];
          // Returns string with first letter captialized
          text = text.substring(0,1).toUpperCase() + text.substring(1).toLowerCase();
          textNode = document.createTextNode(text);
          break;
        default:
          tableCell = document.createElement("td");
          switch (j) {
            case 0:
              textNode = document.createTextNode("#" + i);
              break;
            case 1:
              textNode = document.createTextNode(database[i - 1].name);
              break;
            case 2:
              textNode = document.createTextNode(database[i - 1].wins);
              break;
          }
      }
      tableCell.className = types[j];
      tableCell.appendChild(textNode);
      tableRow.appendChild(tableCell);
    }
    leaderboard.appendChild(tableRow);
  }
  let container = document.getElementById("leaderboardContainer");
  container.appendChild(leaderboard);
}

// Checks to see if a player has any previous wins
function previousWins (playerName) {
  for (var i = 0; i < database.length; i++) {
    if (playerName == database[i].name) {
      return database[i].wins;
    }
  }
  return 0;
}

// Creates and returns player object
function readyPlayer (name, mark, playerNum) {
  var player = {
    name: name,
    mark: mark,
    playerNum: playerNum
  };
  // Records the amount of wins from other games
  player.wins = previousWins(name);
  return player;
}

function startGame () {
  // If either input box is left empty, an error message will appear the game will not begin
  if (!document.getElementById("playerOneName").value || !document.getElementById("playerTwoName").value) {
    alert("An input field has been left empty. Please ensure all fields are filled in before starting the game.");
    return console.log("Error: left name input field empty");
  }
  playerOne = readyPlayer(document.getElementById("playerOneName").value, "X", "one");
  playerTwo = readyPlayer(document.getElementById("playerTwoName").value, "O", "two");
  let array = [playerOne, playerTwo];
  // Resets grid for each game
  for (var i = 0; i < gridCells.length; i++) {
    gridCells[i].innerText = "";
  }
  turnCount = 0;
  // Selects a random item in the array
  activePlayer = array[Math.floor(Math.random()*array.length)];
  document.getElementById("status").innerText = activePlayer.name + "'s turn";
  isGameActive = true;
}

// Updates the database of all players and the leaderboard
function updateLeaderboard (player) {
  let doesPlayerExist = false;
  let playerIndex = 0;
  let winner = {
    name: player.name,
    wins: player.wins
  };
  for (var i = 0; i < database.length; i++) {
    if (winner.name === database[i].name) {
      doesPlayerExist = true;
      playerIndex = i;
    }
  }
  if (doesPlayerExist === true) {
    database.splice(playerIndex, 1, winner);
  } else {
    database.push(winner);
  }
  // Sorts database of players by most wins to least wins
  function compare(a, b) {
    const winsA = a.wins;
    const winsB = b.wins;

    let comparison = 0;
    if (winsA < winsB) {
      comparison = 1;
    } else if (winsA > winsB) {
      comparison = -1;
    }
    return comparison;
  }
  database.sort(compare);

  // Updates the HTML table with new database information
  let nameColumn = document.getElementsByClassName("name");
  let winsColumn = document.getElementsByClassName("wins");
  for (var i = 0; i < 5; i++){
    nameColumn[i+1].innerText = database[i].name;
    winsColumn[i+1].innerText = database[i].wins;
  }
}

function playerWon (player, status, winCondition) {
    status.innerText = activePlayer.name + " wins! (" + winCondition + ")";
    player.wins++;
    isGameActive = false;
    updateLeaderboard(player);
}

function didPlayerWin (player) {
  let status = document.getElementById("status");
  // Updates gridCells array each turn
  gridCells = document.getElementById("TicTacToeGrid").getElementsByTagName("td");
  // Checking rows
  for (var i = 0; i < 9; i = i + 3) {
    // If a row's cells are all the same AND they are not empty cells, the activePlayer wins
    if (gridCells[i].innerText === gridCells[i+1].innerText && gridCells[i+1].innerText === gridCells[i+2].innerText && gridCells[i].innerText === player.mark) {
      playerWon(player, status, "Row");
      return true;
    }
  }
  // Checking columns
  for (var i = 0; i < 3; i++) {
    if (gridCells[i].innerText === gridCells[i+3].innerText && gridCells[i+3].innerText === gridCells[i+6].innerText && gridCells[i].innerText === player.mark) {
      playerWon(player, status, "Column");
      return true;
    }
  }
  // Checking diagonals
  if ((gridCells[0].innerText === gridCells[4].innerText && gridCells[4].innerText === gridCells[8].innerText && gridCells[4].innerText === player.mark) || (gridCells[2].innerText === gridCells[4].innerText && gridCells[4].innerText === gridCells[6].innerText && gridCells[4].innerText === player.mark)) {
    playerWon(player, status, "Diagonal");
    return true;
  }
}

function playerTurn (player, cell) {
  let status = document.getElementById("status");
  // Checks to see if cell is blank before allowing user to mark it
  if (cell.innerText !== "") {
    alert("The cell you clicked already has a mark in it. Please choose another cell.");
    return console.log("Error: Tried to mark already marked cell");
  }
  cell.innerText = player.mark;
  turnCount++;
  // Checks to see if activePlayer won
  switch (true) {
    case turnCount < 9 && turnCount >= 5:
      didPlayerWin(player);
      break;
    case turnCount === 9:
      let doesWinnerExist = didPlayerWin(player);
      isGameActive = false;
      if (doesWinnerExist !== true) {
        status.innerText = "It's a tie!";
      }
      break;
  }
  // Switches activePlayer at the end of each turn
  switch (player) {
    case playerOne:
      activePlayer = playerTwo;
      break;
    case playerTwo:
      activePlayer = playerOne;
      break;
  }
  if (isGameActive === true) {
    status.innerText = activePlayer.name + "'s turn";
  }
}

function init () {
  // Creates and injects leaderboard during initialization
  makeLeaderboard();
  // Adding event handlers
  document.getElementById("startButton").addEventListener("click", startGame);
  document.getElementById("switchButton").onclick = function() {
    if (isGameActive === true) {
      alert("You cannot switch marks during a game. Please finish your current game before changing options.");
      return console.log("Error: Tried to change options mid-game");
    } else {
      var swap = document.getElementById("playerOneName").value;
      document.getElementById("playerOneName").value = document.getElementById("playerTwoName").value;
      document.getElementById("playerTwoName").value = swap;
    }
  };
  gridCells = document.getElementById("TicTacToeGrid").getElementsByTagName("td");
  for (var i = 0; i < gridCells.length; i++) {
    gridCells[i].onclick = function(){
      if (isGameActive === true) {
        playerTurn(activePlayer, this);
      }
    };
  }
}

init();
