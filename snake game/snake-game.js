const gameboard = document.querySelector('#gameBoard');
const ctx = gameboard.getContext('2d');
const scoreText = document.querySelector('#scoreText');
const resetBtn = document.querySelector('#resetBtn');
const gameWidth = gameboard.width;
const gameHeight = gameboard.height;
const boardBackground = 'white';
const snakeColor = 'lightgreen';
const snakeBorder = 'black';
const foodColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
  {x:unitSize * 4, y:0},
  {x:unitSize * 3, y:0},
  {x:unitSize * 2, y:0},
  {x:unitSize, y:0},
  {x:0, y:0},
];

window.addEventListener('keydown', changeDirection);
resetBtn.addEventListener('click', resetGame);

startGameButton();
createFood();

function startGameButton() {
  const button = document.createElement("button");
  button.textContent = "Start Game";
  button.style.fontFamily = "Nanum Brush Script, cursive";
  button.style.fontSize = "22px";
  button.style.width = "150px";
  button.style.height = "50px";
  button.style.border = "4px solid";
  button.style.borderRadius = "15px";
  button.style.cursor = "pointer";
  button.classList.add("start-button"); // Add a class for additional styling

  button.addEventListener("click", startGame); // Add a click event listener

  const container = document.querySelector("#gameContainer");
  container.appendChild(button);
}

// Function to start the game
function startGame() {
  const startButton = document.querySelector(".start-button");
  if (startButton) {
    startButton.remove(); // Remove the button if it exists
  }

  // Reset cursor style
  gameboard.style.cursor = "default";

  // Start your game logic here
  gameStart();
}

function gameStart() {
  running = true;
  scoreText.textContent = score;
  createFood();
  drawFood();
  nextTick();
}
function nextTick() {
  if(running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 100)
  }else {
    displayGameOver();
  }
}
function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function createFood() {
  function randomFood(min, max) {
    const randNum = Math.floor((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);
}
function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}
function moveSnake() {
  const head = {x: snake[0].x + xVelocity,
                y: snake[0].y + yVelocity};

  snake.unshift(head);

  //if food is eaten

  if(snake[0].x == foodX && snake[0].y == foodY) {
    score += 1;
    scoreText.textContent = score;
    createFood();
  }
  else {
    snake.pop();
  }
}
function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;

  snake.forEach(snakePart => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}
function changeDirection(e) {
  const key = e.key;

  switch (key) {
    case "ArrowUp":
      if (yVelocity !== unitSize) {
        xVelocity = 0;
        yVelocity = -unitSize;
      }
      break;

    case "ArrowDown":
      if (yVelocity !== -unitSize) {
        xVelocity = 0;
        yVelocity = unitSize;
      }
      break;

    case "ArrowLeft":
      if (xVelocity !== unitSize) {
        xVelocity = -unitSize;
        yVelocity = 0;
      }
      break;

    case "ArrowRight":
      if (xVelocity !== -unitSize) {
        xVelocity = unitSize;
        yVelocity = 0;
      }
      break;
  }
}
function checkGameOver() {
  // Check if the snake hits the walls
  if (
    snake[0].x < 0 ||
    snake[0].x >= gameWidth ||
    snake[0].y < 0 ||
    snake[0].y >= gameHeight
  ) {
    displayGameOver();
    return;
  }

   // Check if the snake collides with itself
   for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      displayGameOver();
      return;
    }
  }
}
function displayGameOver() {
  // Apply a shadow to create a blurred effect
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;

  // Draw a border with transparency
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  // Reset shadow settings
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  // Set text style
  ctx.font = "50px Nanum Brush Script";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  // Draw "GAME OVER!" text
  ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);

  running = false;
}
function resetGame() {
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;

  snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0},
  ];

  gameStart();
}