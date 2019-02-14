
var canvas;
var ctx;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 5;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;

var winScreen = false;


function calcMP(evt) { // calculate mouse position with event that fires everytime mouse moves
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };
}

    function handleMouseClick(evt) {
      if(winScreen) {
        player1Score = 0;
        player2Score = 0;
        winScreen = false;
      }
    }

    window.onload = function() {
      canvas = document.getElementById('gameCanvas');
      ctx = canvas.getContext('2d');

      var fps = 30;
      setInterval(function () {
        movement();
        draw();
      }, 1000/fps);

      canvas.addEventListener('mousedown', handleMouseClick);

      canvas.addEventListener('mousemove',
            function(evt) {
              var mousePos = calcMP(evt);
              paddle1Y = mousePos.y-(PADDLE_HEIGHT/2)
      });
    }

    function ballReset() {
      if (player1Score >= WINNING_SCORE ||
          player2Score >= WINNING_SCORE) {
            winScreen = true;
      }
      ballSpeedX = -ballSpeedX;
      ballX = canvas.width/2;
      ballY = canvas.height/2;
    }

    function aiMovement() {
      var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
      if (paddle2Y < ballY - 35) {
        paddle2Y += 6;
      } else if (paddle2YCenter > ballY+35) {
        paddle2Y -=  6;
      }
    }

    function movement() {
      if (winScreen) {
          return;
      }
      aiMovement();
      ballX = ballX + ballSpeedX;
      ballY = ballY + ballSpeedY;

      if (ballX < 0) { // resets when ball passes left side
        if(ballY > paddle1Y &&
           ballY < paddle1Y+PADDLE_HEIGHT) {
                 ballSpeedX = - ballSpeedX;
                 var deltaY = ballY
                     -(paddle1Y+PADDLE_HEIGHT/2);
                 ballSpeedY = deltaY * 0.35;
           } else {
             player2Score ++; // must be before ballReset()
             ballReset();

           }
      }

      if (ballX > canvas.width) {
        if(ballY > paddle2Y &&
           ballY < paddle2Y+PADDLE_HEIGHT) {
                 ballSpeedX = - ballSpeedX;
                 var deltaY = ballY
                     -(paddle2Y+PADDLE_HEIGHT/2);
                 ballSpeedY = deltaY * 0.35;
           } else {
             player1Score ++; // must be before ballReset()
             ballReset();
           }
      }
      if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
      }
      if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
      }
    }

    function drawNet() { // draws the net in the middle
      for (var i=0; i < canvas.height; i+=40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
      }
    }

    function draw() {
      colorRect(0,0, canvas.width, canvas.height, 'black'); // background of tennis court

      if (winScreen) {
      ctx.fillStyle = 'White';
        if (player1Score >= WINNING_SCORE) { // if score is greater than or equal to winningscore left player won
          ctx.fillText("Left Player Won!", 350, 200);
        } else if (player2Score >= WINNING_SCORE) { // if score is greater than or equal to winning score right player won
            ctx.fillText("Right Player Won! ", 350, 200);
        }
        ctx.fillText("Click to play again", 350, 500);
        return;
      }

      drawNet();

      colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white'); // left player paddle

      colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y,
                PADDLE_THICKNESS, PADDLE_HEIGHT, 'white'); // right player computer paddle

      colorCircle(ballX, ballY, 10, 'white'); // draws the ball

      ctx.fillText(player1Score, 100, 100); // text content and position of player score left
      ctx.fillText(player2Score, canvas.width -100, 100); // text content and position of player score right
    }

    function colorRect(leftX, topY, width, height, drawColor) { // method can draw a rectangle
      ctx.fillStyle = drawColor;
      ctx.fillRect(leftX, topY, width, height);
    }

    function colorCircle(centerX, centerY, radius, drawColor) { // method can draw a circle
      ctx.fillStyle = drawColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI*2, true);
      ctx.fill();
    }
