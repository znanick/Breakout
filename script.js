"use strict";

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
  var brickCountX = 6;
  var brickCountY = 5;
  var brickCharacter = {
    width: 8 * gamePixel,
    height: 2 * gamePixel,
    margin: (50 * gamePixel - 8 * gamePixel * brickCountX) / (brickCountY + 1), //отступы между кирпичами
  };
  var marginArea = //отступ между полем и кирпичами
    (50 * gamePixel -
      (brickCharacter.margin * (brickCountX - 1) +
        brickCharacter.width * brickCountX)) /
    2;

  var ball = {
    radius: gamePixel,
    posX: area.width / 2,
    posY: area.height / 2,
    speedX: 0,
    speedY: 0,
  };

  var platform = {
    width: 8 * gamePixel,
    height: 1.5 * gamePixel,
    posX: area.width / 2 - 4 * gamePixel,
    posY: area.height - 1.5 * gamePixel,
    speedX: 0,
  };

  this.onLoadPage = function () {
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

    this.update();
  };

  this.random = function (n, m) {
    0;
    //рандом из интервала чисел a , b
    return Math.floor(Math.random() * (m - n + 1)) + n;
  };

  this.update = function(){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, area.width, area.height);
    this.drawGameArea();
    this.drawBall();
    this.drawPlatform();
    this.drawBricks();
    this.drawHeart();
    this.drawScore();
    this.keyDown()
    this.keyUp()

    platform.posX = platform.posX + platform.speedX;
    
    requestAnimationFrame(this.update);
  }

  this.keyDown = function(){
    document.addEventListener("keydown", function (a) {
      //Если нажата клавиша A
      if (a.which === 65) {
        platform.speedY = -gamePixel/2;
      }
  
      // Если нажата клавиша D
      else if (a.which === 68) {
        platform.speedY = gamePixel/2;
      }
  })}

  this.keyUp = function(){
    document.addEventListener("keyup", function (a) {
      
      if (a.which === 65 || a.which === 68) {
        platform.speedY = 0;
      }
  
      
      
  })
  }

  this.drawGameArea = function () {

    ctx.beginPath();
    ctx.rect(0, 0, area.width, area.height);
    ctx.fillStyle = "#EFEFEF";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
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
            y * (brickCharacter.height + gamePixel / 2) + gamePixel * 2;
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
          } else {
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
