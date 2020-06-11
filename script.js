"use strict";
var a = document.getElementById("gameArea");
a.style.height = (a.offsetWidth * 2) / 3 + "px";
var game = new BreakOut("gameArea");
game.onLoadPage();

function BreakOut(div) {
  this.gameArea = document.getElementById(div);
  var canvasArea = document.createElement("canvas");
  var ctx = canvasArea.getContext("2d");
  var life = 3;
  this.score = 0;

  var area = {
    width: this.gameArea.offsetWidth,
    height: this.gameArea.offsetHeight,
  };

  var gamePixel = area.width / 50; //все состовляющие игры будут строится относительно этого значения

  var bricks = [];
  var brickCountX = 4;
  var brickCountY = 4;
  var brickCharacter = {
    width: 6 * gamePixel,
    height: 1.2 * gamePixel,
    margin:
      (50 * gamePixel - 6.5 * gamePixel * brickCountX) / (brickCountY + 1), //отступы между кирпичами
  };
  var marginArea = //отступ между полем и кирпичами
    (50 * gamePixel -
      (brickCharacter.margin * (brickCountX - 1) +
        brickCharacter.width * brickCountX)) /
    2;
  var marginUp = gamePixel * 2;

  var platform = {
    width: 8 * gamePixel,
    height: gamePixel,
    posX: area.width / 2 - 4 * gamePixel,
    posY: area.height - gamePixel,
    speedX: 0,
  };

  var ball = {
    radius: gamePixel / 3,
    posX: area.width / 2,
    posY: area.height - platform.height - gamePixel / 3,
    speedX: 0,
    speedY: 0,
  };

  var gameStatus = 0;

  this.onLoadPage = function () {
    gameStatus = 0;
    for (var y = 0; y < brickCountY; y++) {
      bricks[y] = [];
      for (var x = 0; x < brickCountX; x++) {
        bricks[y][x] = { posX: 0, posY: 0, status: this.random(1, 3) };
      }
    }
    this.gameArea.appendChild(canvasArea);
    canvasArea.setAttribute("width", area.width);
    canvasArea.setAttribute("height", area.height);
    this.drawGameArea();
    this.drawBall();
    this.drawPlatform();
    this.drawBricks();
    this.drawHeart();
    this.drawScore();
    this.startBall();
    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("keyup", this.keyUp);
    document.addEventListener("mousemove", this.mouseMove);
    this.update();
  };

  this.random = function (n, m) {
    //рандом из интервала чисел a , b
    return Math.floor(Math.random() * (m - n + 1)) + n;
  };

  this.update = function () {
    ball.posX = ball.posX + ball.speedX;
    ball.posY = ball.posY + ball.speedY;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, area.width, area.height);
    this.startBall();
    this.drawGameArea();
    this.drawBall();
    this.drawPlatform();
    this.drawBricks();
    this.drawHeart();
    this.drawScore();
    this.areaColision();
    this.platformColision();
    this.platformMove();
    this.brickColision();
    requestAnimationFrame(() => {
      this.update();
    });
  };

  this.mouseMove = function (e) {
    if (life) {
      var relativeX = e.clientX - 11 * gamePixel;
      if (relativeX > 0 && relativeX < area.width) {
        platform.posX = relativeX - platform.width / 2;
      }
    }
  };

  this.keyDown = function (a) {
    //Если нажата клавиша A
    if (a.which == 65 && gameStatus == 1) {
      platform.speedX = -gamePixel / 3;
    }
    // Если нажата клавиша D
    else if (a.which == 68 && gameStatus == 1) {
      platform.speedX = gamePixel / 3;
    }
    if (gameStatus == 0) {
      platform.speedX = 0;
    }
  };

  this.keyUp = function (a) {
    if (a.which === 65 || a.which === 68) {
      platform.speedX = 0;
    }
  };

  this.platformMove = function () {
    platform.posX = platform.posX + platform.speedX;
    if (platform.posX < 0) {
      platform.speedX = 0;
      platform.posX = 0;
    }
    if (platform.posX > area.width - platform.width) {
      platform.speedX = 0;
      platform.posX = area.width - platform.width;
    }
  };

  this.platformColision = function () {
    if (
      ball.posX <= platform.posX + platform.width &&
      ball.posX >= platform.posX &&
      ball.posY >= platform.posY - ball.radius
    ) {
      ball.posY = platform.posY - ball.radius;
      ball.speedY = -ball.speedY;
    }
  };

  this.brickColision = function () {
    for (var y = 0; y < brickCountY; y++) {
      for (var x = 0; x < brickCountX; x++) {
        var b = bricks[y][x];
        if (b.status != 0) {
          if (
            ball.posX > b.posX &&
            ball.posX < b.posX + brickCharacter.width &&
            ball.posY > b.posY - ball.radius &&
            ball.posY < b.posY + brickCharacter.height + ball.radius
          ) {
            ball.speedY = -ball.speedY;
            b.status = b.status - 1;
            this.score++;
          }
        }
      }
    }
  };

  this.areaColision = function () {
    if (ball.posX < 0 + ball.radius) {
      //левая стена
      ball.speedX = -ball.speedX;
      ball.posX = 0 + ball.radius;
    }
    if (ball.posX > area.width - ball.radius) {
      //правая стена
      ball.speedX = -ball.speedX;
      ball.posX = area.width - ball.radius;
    }
    if (ball.posY < 0 + ball.radius + marginUp) {
      ball.speedY = -ball.speedY;
      ball.posY = 0 + ball.radius + marginUp;
      platform.width = 4 * gamePixel;
    }
    if (ball.posY > area.height - ball.radius) {
      gameStatus = 0; //запрещаем двигаться платформе , пока мяч снова не начнет движение
      life = life - 1;
      ball.posY = area.height - ball.radius;
      ball.speedY = 0;
      ball.speedX = 0;

      if (life) {
        setTimeout(() => {
          this.startBall();
        }, 1000);
      } else if (!life) {
        //потом тут будем выдвигать таблицу рекордов
      }
    }
  };

  this.startBall = function () {
    if (gameStatus == 0 && life) {
      ball.posX = platform.posX + platform.width / 2;
      ball.posY = area.height - platform.height - gamePixel / 3;
      document.addEventListener("click", () => {
        if (gameStatus == 0 && life) {
          gameStatus = 1;
          ball.speedY = -gamePixel / 4;
          if (this.random(1, 2) == 1) {
            ball.speedX = -gamePixel / 4;
          } else {
            ball.speedX = gamePixel / 4;
          }
        }
      });
    }
  };

  this.drawGameArea = function () {
    ctx.beginPath();
    ctx.rect(0, 0, area.width, area.height);
    ctx.fillStyle = "#EFEFEF";
    ctx.fill();

    ctx.closePath();
  };

  this.drawBall = function () {
    ctx.beginPath();
    ctx.arc(ball.posX, ball.posY, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  };

  this.drawPlatform = function () {
    ctx.beginPath();
    ctx.rect(platform.posX, platform.posY, platform.width, platform.height);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  };

  this.drawBricks = function () {
    for (var y = 0; y < brickCountY; y++) {
      for (var x = 0; x < brickCountX; x++) {
        if (bricks[y][x].status >= 1) {
          bricks[y][x].posX =
            x * (brickCharacter.width + brickCharacter.margin) + marginArea;
          bricks[y][x].posY =
            y * (brickCharacter.height + gamePixel / 2) + marginUp;
          ctx.beginPath();
          ctx.rect(
            bricks[y][x].posX,
            bricks[y][x].posY,
            brickCharacter.width,
            brickCharacter.height
          );
          if (bricks[y][x].status == 1) {
            ctx.fillStyle = "green";
          } else if (bricks[y][x].status == 2) {
            ctx.fillStyle = "#0095DD";
          } else if (bricks[y][x].status == 3) {
            ctx.fillStyle = "#FF0000";
          }
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  };

  this.drawHeart = function () {
    for (var i = 0; i < life; i++) {
      var w = gamePixel * 1.7,
        h = gamePixel * 1.7;

      ctx.shadowOffsetX = 4.0;
      ctx.shadowOffsetY = 4.0;
      ctx.lineWidth = 10.0;
      ctx.fillStyle = "#FF0000";
      var d = Math.min(w, h);
      var k = (w + gamePixel / 2) * i + gamePixel / 8;
      var m = gamePixel / 8;

      ctx.moveTo(k, m + d / 4);
      ctx.quadraticCurveTo(k, m, k + d / 4, m);
      ctx.quadraticCurveTo(k + d / 2, m, k + d / 2, m + d / 4);
      ctx.quadraticCurveTo(k + d / 2, m, k + (d * 3) / 4, m);
      ctx.quadraticCurveTo(k + d, m, k + d, m + d / 4);
      ctx.quadraticCurveTo(k + d, m + d / 2, k + (d * 3) / 4, m + (d * 3) / 4);
      ctx.lineTo(k + d / 2, m + d);
      ctx.lineTo(k + d / 4, m + (d * 3) / 4);
      ctx.quadraticCurveTo(k, m + d / 2, k, m + d / 4);
      ctx.fill();
    }
  };

  this.drawScore = function () {
    ctx.font = gamePixel * 1.5 + "px Monospace";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(
      "Score: " + this.score,
      area.width - gamePixel * 9,
      gamePixel * 1.5
    );
  };
}
