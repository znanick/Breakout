"use strict";
var pixel = document.getElementById("gameArea").offsetWidth / 50;
var game = {
  w: document.getElementById("gameArea").offsetWidth,
  h: document.getElementById("gameArea").offsetHeight,
  pixel: document.getElementById("gameArea").offsetWidth / 50,
  ball: {},
  platform: {},
  running: true,
  bricks: [],
  brickCountX: 0, //12 - max
  brickCountY: 0,
  brickCharacter: {
    w: 4 * pixel,
    h: 1.2 * pixel,
  },
  score: 0,
  localRecord: "localRecord",
  hearts: 3,
  gameStatus: 0,
  random: function (n, m) {
    //рандом из интервала чисел a , b
    return Math.floor(Math.random() * (m - n + 1)) + n;
  },

  init: function () {
    document.getElementById("myCanvas").setAttribute("width", this.w);
    document.getElementById("myCanvas").setAttribute("height", this.h);
    this.ctx = document.getElementById("myCanvas").getContext("2d");
    document.addEventListener("keydown", function (a) {
      if (a.keyCode == 32 && game.gameStatus == 0) {
        game.gameStatus = 1;
        game.ball.jump();
      } else if (a.which == 65) {
        game.platform.dx = -game.platform.velo;
      } else if (a.which == 68) {
        game.platform.dx = game.platform.velo;
      }
    });
    document.addEventListener("keyup", function (a) {
      game.platform.stop();
    });
    document.addEventListener("click", function () {
      if (game.gameStatus == 0) {
        game.gameStatus = 1;
        game.ball.jump();
        console.log('click');
      }
    });
    document.addEventListener("mousemove", game.platform.mouseMove);

    //получаем из локального хранилища макс счет
    if (!localStorage[game.localRecord]) {
      localStorage.setItem(game.localRecord, JSON.stringify(this.score));
    }
  },

  createBricks: function () {
    var marginUp = this.pixel * 4;
    var margin =
      (50 * this.pixel - 4 * this.pixel * this.brickCountX) /
      (this.brickCountX + 1);
    var marginArea =
      (50 * this.pixel -
        (margin * (this.brickCountX - 1) +
          this.brickCharacter.w * this.brickCountX)) /
      2;
    for (var row = 0; row < this.brickCountX; row++) {
      for (var col = 0; col < this.brickCountY; col++) {
        this.bricks.push({
          x: row * (this.brickCharacter.w + margin) + marginArea,
          y: col * (this.brickCharacter.h + this.pixel / 6) + marginUp,
          w: this.brickCharacter.w,
          h: this.brickCharacter.h,
          lifes: this.random(1, 3),
        });
      }
    }
  },

  render: function () {
    this.ctx.clearRect(0, 0, this.w, this.h);

    //поле
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.w, this.h);
    this.ctx.fillStyle = "#EFEFEF";
    this.ctx.fill();
    this.ctx.closePath();

    //платформа
    this.ctx.beginPath();
    this.ctx.rect(
      game.platform.x,
      game.platform.y,
      game.platform.w,
      game.platform.h
    );
    this.ctx.fillStyle = "blue";
    this.ctx.fill();
    this.ctx.closePath();

    //шар
    this.ctx.beginPath();
    this.ctx.arc(game.ball.x, game.ball.y, game.ball.rad, 0, Math.PI * 2);
    this.ctx.fillStyle = "blue";
    this.ctx.fill();
    this.ctx.closePath();

    //кирпичи
    this.bricks.forEach(function (element) {
      if (element.lifes >= 1) {
        this.ctx.beginPath();
        this.ctx.rect(element.x, element.y, element.w, element.h);
        if (element.lifes == 1) {
          this.ctx.fillStyle = "green";
        } else if (element.lifes == 2) {
          this.ctx.fillStyle = "#0095DD";
        } else if (element.lifes == 3) {
          this.ctx.fillStyle = "#FF0000";
        }
        this.ctx.fill();
        this.ctx.closePath();
      }
    }, this);

    //жизни
    for (var i = 0; i < this.hearts; i++) {
      var w = this.pixel * 2,
        h = this.pixel * 2;

      this.ctx.shadowOffsetX = 4.0;
      this.ctx.shadowOffsetY = 4.0;
      this.ctx.lineWidth = 10.0;
      this.ctx.fillStyle = "#FF0000";
      var d = Math.min(w, h);
      var k = (w + this.pixel / 2) * i + this.pixel / 8;
      var m = this.pixel / 2;

      this.ctx.moveTo(k, m + d / 4);
      this.ctx.quadraticCurveTo(k, m, k + d / 4, m);
      this.ctx.quadraticCurveTo(k + d / 2, m, k + d / 2, m + d / 4);
      this.ctx.quadraticCurveTo(k + d / 2, m, k + (d * 3) / 4, m);
      this.ctx.quadraticCurveTo(k + d, m, k + d, m + d / 4);
      this.ctx.quadraticCurveTo(
        k + d,
        m + d / 2,
        k + (d * 3) / 4,
        m + (d * 3) / 4
      );
      this.ctx.lineTo(k + d / 2, m + d);
      this.ctx.lineTo(k + d / 4, m + (d * 3) / 4);
      this.ctx.quadraticCurveTo(k, m + d / 2, k, m + d / 4);
      this.ctx.fill();
    }

    //счет
    this.ctx.font = this.pixel * 1.5 + "px Monospace";
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fillText(
      "Score: " + this.score,
      this.w - this.pixel * 9,
      this.pixel * 2
    );
  },

  update: function () {
    if (this.platform.dx) {
      this.platform.move();
    }

    if (this.ball.collide(this.platform)) {
      this.ball.bumpPuddle(this.platform);
    }

    if (game.gameStatus == 0) {
      this.ball.x = this.platform.x + this.platform.w / 2;
    }
    if (
      (this.gameStatus == 1 && this.ball.dx) ||
      (this.gameStatus == 1 && this.ball.dy)
    ) {
      this.ball.move();
    }

    this.bricks.forEach(function (element) {
      if (element.lifes > 0) {
        if (this.ball.collide(element)) {
          this.ball.bumpBrick(element);
        }
      }
    }, this);
    this.ball.checkBounds();
  },
  run: function () {
    this.update();
    this.render();

    if (this.running) {
      window.requestAnimationFrame(function () {
        game.run();
      });
    }
  },

  start: function () {
    this.init();
    this.run();
    this.createBricks();
  },

  gameOverScore: function (key) {
    //local storage
    if (this.score > JSON.parse(localStorage[key])) {
      localStorage[key] = JSON.stringify(this.score);
    }
    console.log(localStorage[key]);
    var recordContainer = document.getElementById("recordContainer");
    var lr = document.createElement("p");
    lr.innerHTML = "Ваш рекорд " + localStorage[key];
    recordContainer.appendChild(lr);
    recordContainer.style.top = "15%";
  },
};



game.platform = {
  x: game.w / 2 - game.pixel * 4,
  y: game.h - game.pixel / 2,
  w: game.pixel * 8,
  h: game.pixel / 2,
  velo: game.pixel,
  dx: 0,
  ball: game.ball,
  mouseMove: function (e) {
    var relativeX = e.clientX - 25 * game.pixel;
    if (relativeX > 0 && relativeX < game.w) {
      game.platform.x = relativeX - game.platform.w / 2;
    }
  },
  move: function () {
    this.x += this.dx;
  },

  stop: function () {
    this.dx = 0;
  },
};
game.ball = {
  x: 0,
  y: game.platform.y - game.pixel / 3,
  rad: game.pixel / 3,
  dx: 0,
  dy: 0,
  velo: game.pixel / 2,

  jump: function () {
    this.dy = -this.velo;
    if (game.random(1, 2) == 1) {
      this.dx = -this.velo;
    } else {
      this.dx = this.velo;
    }
  },

  move: function () {
    this.x += this.dx;
    this.y += this.dy;
  },

  collide: function (element) {
    var x = this.x + this.dx;
    var y = this.y + this.dy;

    if (
      x + this.rad > element.x &&
      x < element.x + element.w &&
      y + this.rad > element.y &&
      y < element.y + element.h
    ) {
      return true;
    }
    return false;
  },
  bumpBrick: function (bricks) {
    bricks.lifes--;
    this.dy *= -1;
    audio.bam.sound();
    ++game.score;
  },

  bumpPuddle: function (platform) {
    this.dy = -this.velo;
    if (this.onTheLeftSide(platform)) {
      this.dx = -this.velo;
    } else {
      this.dx = this.velo;
    }
  },

  onTheLeftSide: function (platform) {
    return this.x + this.rad / 2 < platform.x + platform.w / 2;
  },

  checkBounds: function () {
    var x = this.x + this.dx;
    var y = this.y + this.dy;

    if (x < 0) {
      this.x = 0;
      this.dx = this.velo;
    } else if (x + this.rad > game.w) {
      this.x = game.w - this.rad;
      this.dx = -this.velo;
    } else if (y < 0) {
      this.y = 0;
      this.dy = this.velo;
      game.platform.w = game.pixel * 4;
    } else if (this.y >= game.h) {
      game.hearts -= 1;
      if (game.hearts > 0) {
        this.startBall();
      } else if (game.hearts == 0) {
        audio.gameOver.sound();
        console.log("game over");
        game.gameOverScore(game.localRecord);
        //таблица рекордов
      }
    }
  },
  startBall: function () {
    this.y = game.platform.y - game.pixel / 3;
    this.x = 0;

    game.gameStatus = 0;
  },
};

var audio = {
  gameOver: {},
  bam: {},
};

audio.gameOver = {
  audio: new Audio("Audio/GameOver.mp3"),
  soundInit: function () {
    this.audio.play(); // запускаем звук
    this.audio.pause(); // и сразу останавливаем
  },
  sound: function () {
    this.audio.currentTime = 0; // в секундах
    this.audio.play();
  },
};

audio.bam = {
  audio: new Audio("Audio/Bam.mp3"),
  soundInit: function () {
    this.audio.play(); // запускаем звук
    this.audio.pause(); // и сразу останавливаем
  },
  sound: function () {
    this.audio.currentTime = 0; // в секундах
    this.audio.play();
  },
};
