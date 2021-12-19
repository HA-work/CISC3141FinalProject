// Criminal
function Criminal(point) {
  var gp = new GamePiece();
  gp.evade = Criminal_evade;
  return gp.construct(
    "Criminal",
    point,
    "You smell cigar smoke",
    "The criminal spotted you!"
  );
}

function Criminal_evade(dir) {
  this.move(dir);
  if (this.isTouching(game.hero)) {
    this.evade(randomDirection());
  }
}

// Gas
function Gas(point) {
  var gp = new GamePiece();
  return gp.construct(
    "Gas",
    point,
    "You see green gas",
    "You became disorientated!"
  );
}

// Alarm
function Alarm(point) {
  var gp = new GamePiece();
  return gp.construct(
    "Alarm",
    point,
    "You hear ticking",
    "You tripped the alarm!"
  );
}

// Hero
function Hero(point) {
  var gp = new GamePiece();
  gp.guesses = 5;
  return gp.construct("Hero", point, "", "");
}

//Guess
function ExtraGuess(point) {
  var gp = new GamePiece();
  return gp.construct("Extra Guess", point, "", "You found an extra guess!");
}

function GamePiece() {
  this.name;
  this.message;
  this.x;
  this.y;
}

function GamePiece_construct(name, point, adjacentMessage, touchingMessage) {
  this.name = name;
  this.adjacentMessage = adjacentMessage;
  this.touchingMessage = touchingMessage;
  this.x = point.x;
  this.y = point.y;
  return this;
}

function GamePiece_isAdjacent(gp) {
  if (Math.abs(this.x - gp.x) <= 1 && Math.abs(this.y - gp.y) <= 1) {
    return true;
  } else {
    return false;
  }
}

function GamePiece_isTouching(gp) {
  if (this.x == gp.x && this.y == gp.y) {
    return true;
  } else {
    return false;
  }
}

function GamePiece_move(dir) {
  switch (dir) {
    case "left":
      if (this.x > 0) this.x--;
      break;
    case "up":
      if (this.y > 0) this.y--;
      break;
    case "right":
      if (this.x < game.board.space.length - 1) this.x++;
      break;
    case "down":
      if (this.y < game.board.space[0].length - 1) this.y++;
      break;
    default:
      //

      break;
  }
}

GamePiece.prototype.construct = GamePiece_construct;
GamePiece.prototype.isAdjacent = GamePiece_isAdjacent;
GamePiece.prototype.isTouching = GamePiece_isTouching;
GamePiece.prototype.move = GamePiece_move;

function Game() {
  this.width; // width of board in spaces
  this.height; // height of board in spaces
  this.guessesLeft;
  this.feedback;
  this.board;
  this.hero;
  this.alarm;
  this.gas;
  this.criminal;
}

function Game_init() {
  var defaultWidth = 5;
  var defaultHeight = 5;
  var minWidth = 2;
  var minHeight = 2;
  var maxWidth = 12;
  var maxHeight = 12;

  this.guessesLeft = 5;
  this.feedback = new Feedback();

  if (arguments.length == 2) {
    this.width = arguments[0].parseInt();
    this.height = arguments[1].parseInt();
  } else {
    this.width = defaultWidth;
    this.height = defaultHeight;
  }
  if (this.width > maxWidth || this.height > maxHeight) {
    this.width = defaultWidth;
    this.height = defaultHeight;
  }
  if (this.width < minWidth || this.height < minHeight) {
    this.width = defaultWidth;
    this.height = defaultHeight;
  }

  this.board = buildBoard(this.width, this.height);

  this.gas = new Gas(this.board.getRandomSpace());

  this.alarm = new Alarm(this.board.getRandomEmptySpace());

  this.criminal = new Criminal(this.board.getRandomSpace());

  this.extraGuess = new ExtraGuess(this.board.getRandomEmptySpace());

  this.hero = new Hero(this.board.getRandomEmptySpace());

  this.board.space[this.hero.x][this.hero.y] = this.hero;

  move("standstill");

  return this;
}

function Game_updateGuesses(i) {
  this.guessesLeft += i;
  document.getElementById("guessesLeft").innerHTML = this.guessesLeft;
}

function Game_win() {
  if (confirm("You found the criminal!!! New game?")) {
    game.init();
  } else {
    game.end();
  }
}

function Game_lose() {
  this.feedback.addMessage("The criminal escaped!");
  if (confirm("You lost! New game?")) {
    game.init();
  } else {
    game.end();
  }
}

function Game_end() {
  document.getElementById("movementControls").style.display =
    document.getElementById("guessControls").style.display = "none";
}

Game.prototype.init = Game_init;
Game.prototype.win = Game_win;
Game.prototype.lose = Game_lose;
Game.prototype.end = Game_end;

Game.prototype.updateGuesses = Game_updateGuesses;

function GameBoard() {
  this.space;
}

function GameBoard_construct(x, y) {
  this.space = new Array(x);
  for (var i = 0; i < y; i++) {
    this.space[i] = new Array(y);
  }
}

function GameBoard_getRandomPoint() {
  return {
    x: Math.floor(Math.random() * this.space.length),
    y: Math.floor(Math.random() * this.space[0].length),
  };
}

function GameBoard_getRandomSpace() {
  var point = this.getRandomPoint();

  this.space[point.x][point.y] = "occupied";
  return point;
}

function GameBoard_getRandomEmptySpace() {
  var point = this.getRandomPoint();
  if (this.space[point.x][point.y] == undefined) {
    this.space[point.x][point.y] = "occupied";
    return { x: point.x, y: point.y };
  } else {
    return this.getRandomEmptySpace();
  }
}

GameBoard.prototype.construct = GameBoard_construct;
GameBoard.prototype.getRandomPoint = GameBoard_getRandomPoint;
GameBoard.prototype.getRandomSpace = GameBoard_getRandomSpace;
GameBoard.prototype.getRandomEmptySpace = GameBoard_getRandomEmptySpace;

function Feedback() {
  if (!document.getElementById("feedback")) {
    var feedbackElement = document.createElement("div");

    feedbackElement.id = "feedback";

    document.getElementsByTagName("body")[0].appendChild(feedbackElement);
  }
  this.message = document.getElementById("feedback");
  return this;
}

function Feedback_addMessage(msg) {
  this.message.innerHTML += msg + "<br>";
}

function Feedback_clear() {
  this.message.innerHTML = "";
}

Feedback.prototype.addMessage = Feedback_addMessage;
Feedback.prototype.clear = Feedback_clear;

function whereIs() {
  alert("The Player is at " + myHero.x + "," + myHero.y);
  alert("The gas is at " + myGas.x + "," + myGas.y);
  alert("The alarm is at " + myAlarm.x + "," + myAlarm.y);
  alert("The criminal is at " + myCriminal.x + "," + myCriminal.y);
}

function checkTouch() {
  var isTouchingAnythingDangerous = false;
  if (game.hero.isTouching(game.gas)) {
    isTouchingAnythingDangerous = true;

    highlight(game.hero.x, game.hero.y);
    pt = game.board.getRandomSpace();
    game.hero.x = pt.x;
    game.hero.y = pt.y;

    move("standstill");
    game.feedback.addMessage(game.gas.touchingMessage);
  }
  if (game.hero.isTouching(game.alarm)) {
    isTouchingAnythingDangerous = true;
    game.feedback.addMessage(game.alarm.touchingMessage);

    game.lose();
  }
  if (game.hero.isTouching(game.criminal)) {
    isTouchingAnythingDangerous = true;
    game.feedback.addMessage(game.criminal.touchingMessage);

    game.lose();
  }
  if (game.hero.isTouching(game.extraGuess)) {
    game.updateGuesses(1);

    game.extraGuess.x = -1;
    game.extraGuess.y = -1;
    // remove extra guess from board
    game.feedback.addMessage(game.extraGuess.touchingMessage);
  }
  return isTouchingAnythingDangerous;
}

function checkAdjacent() {
  if (game.hero.isAdjacent(game.gas))
    game.feedback.addMessage(game.gas.adjacentMessage);
  if (game.hero.isAdjacent(game.alarm))
    game.feedback.addMessage(game.alarm.adjacentMessage);
  if (game.hero.isAdjacent(game.criminal))
    game.feedback.addMessage(game.criminal.adjacentMessage);
}

function highlight(x, y) {
  color = "pink";
  if (arguments.length == 3) color = arguments[2];
  cells = document.getElementById("gameBoard").getElementsByTagName("td");
  cells[
    x +
      y *
        document
          .getElementById("gameBoard")
          .getElementsByTagName("tr")[0]
          .getElementsByTagName("td").length
  ].style.backgroundColor = color;
}

// maybe change guess to another name because of ambiguity
function guess(dir) {
  if (game.guessesLeft > 0) {
    game.updateGuesses(-1);
    var guess = new GamePiece();
    guess.construct("guess", { x: game.hero.x, y: game.hero.y }, "", "");
    guess.move(dir);
    if (guess.isTouching(game.criminal)) {
      game.feedback.addMessage("You WIN!!!");
      game.win();
    } else {
      game.criminal.evade(randomDirection());
      move("standstill");
      game.feedback.addMessage("Oh no! Wrong room!");
    }
  } else {
    game.feedback.addMessage("Out of guesses!");
  }
}

function move(dir) {
  highlight(game.hero.x, game.hero.y);

  game.feedback.clear();

  game.hero.move(dir);

  game.feedback.addMessage("You are at " + game.hero.x + "," + game.hero.y);

  highlight(game.hero.x, game.hero.y, "red");

  if (!checkTouch()) {
    checkAdjacent();
  }
}

function randomDirection() {
  var dir;
  var x = Math.ceil(Math.random() * 5);
  switch (x) {
    case 1:
      dir = "up";
      break;
    case 2:
      dir = "right";
      break;
    case 3:
      dir = "down";
      break;
    case 4:
      dir = "left";
      break;
      defaultcase: dir = "standstill";
      break;
  }
  return dir;
}

function buildBoard(x, y) {
  var boardHTML = '<table id="board">';
  for (var i = 0; i < x; i++) {
    boardHTML += '<tr id="' + x + '">';
    for (var j = 0; j < y; j++) {
      boardHTML += "<td></td>";
    }
    boardHTML += "</tr>";
  }

  boardHTML += "</table>";
  document.getElementById("gameBoard").innerHTML = boardHTML;

  var myBoard = new GameBoard();
  myBoard.construct(x, y);

  return myBoard;
}
