var settings = {
  userName: "",
  ry: document.getElementById("ry"),
  rx: document.getElementById("rx"),

  ryView: function () {
    document.getElementById("ryTxt").innerHTML = this.ry.value;
  },

  rxView: function () {
    document.getElementById("rxTxt").innerHTML = this.rx.value;
  },

  start: function () {
    var inp = document.getElementById("userName");
    if (!inp.value) {
      inp.focus();
    } else {
      document.getElementById("start-but").disabled = true;
      document.getElementById("settings").style.top = "-120%";
      settings.userName = inp.value;
      game.brickCountX = rx.value;
      game.brickCountY = ry.value;
      setTimeout(function () {
        game.start();
      }, 700);
    }
  },
};

var recordsAjax = {
  ajaxHandlerScript: "https://fe.it-academy.by/AjaxStringStorage2.php",
  updatePassword: null,
  stringName: "ZAKHARENKO_NICK_ARCANOID",
  topGamer: {},

  afterGame: function () {
    this.restoreInfo();
  },

  storeInfo: function () {
    this.updatePassword = Math.random();
    $.ajax({
      url: this.ajaxHandlerScript,
      type: "POST",
      cache: false,
      dataType: "json",
      data: { f: "LOCKGET", n: this.stringName, p: this.updatePassword },
      success: this.lockGetReady,
      error: this.errorHandler,
    });
  },

  lockGetReady: function (callresult) {
    console.log(recordsAjax.topGamer);
    var res = JSON.stringify(recordsAjax.topGamer);
    console.log(res);
    if (callresult.error != undefined) alert(callresult.error);
    else {
      $.ajax({
        url: recordsAjax.ajaxHandlerScript,
        type: "POST",
        cache: false,
        dataType: "json",
        data: {
          f: "UPDATE",
          n: recordsAjax.stringName,
          v: res,
          p: recordsAjax.updatePassword,
        },
        success: this.updateReady,
        error: this.errorHandler,
      });
    }
  },

  updateReady: function (callresult) {
    if (callresult.error != undefined) alert(callresult.error);
  },

  restoreInfo: function () {
    $.ajax({
      url: this.ajaxHandlerScript,
      type: "POST",
      cache: false,
      dataType: "json",
      data: { f: "READ", n: this.stringName },
      success: this.readReady,
      error: this.errorHandler,
    });
  },

  readReady: function (callresult) {
    var record;
    if (callresult.error != undefined) alert(callresult.error);
    else if (callresult.result != "") {
      record = JSON.parse(callresult.result);
      recordsAjax.topGamer = record;
      console.log(record);
      recordsAjax.comparison(record);
    }
    gameOverPage.topGamer = recordsAjax.topGamer;
  },

  errorHandler: function (jqXHR, statusStr, errorStr) {
    alert(statusStr + " " + errorStr);
  },

  comparison: function (record) {
    console.log(this.topGamer);
    console.log(record);

    if (game.score > record.score) {
      record.name = settings.userName;
      record.score = game.score;
      this.topGamer = record;
      console.log(this.topGamer);
      this.storeInfo();
    }
  },
};

var gameOverPage = {
  scoreDiv: document.getElementById("score"),
  ls: document.createElement("p"),

  userRecord: document.getElementById("userRecord"),
  lr: document.createElement("p"),

  ajaxRecord: document.getElementById("ajaxRecord"),
  ar: document.createElement("p"),

  topGamer: null,

  gameOver: function () {
    document.getElementById("reload-btn").disabled = false;
    //счет на конец игры
    this.ls.innerHTML = "Ваш счет: " + game.score;
    this.scoreDiv.appendChild(this.ls);
    this.ls.style.fontSize = "3vh";
    //AJAX

    this.ar.innerHTML =
      "Рекорд: " +
      gameOverPage.topGamer.name +
      " " +
      gameOverPage.topGamer.score +
      " очков";
    this.ajaxRecord.appendChild(this.ar);
    this.ar.style.fontSize = "3vh";

    //рукорд пользователя
    this.lr.innerHTML = "Ваш рекорд: " + localStorage[game.localRecord];
    this.userRecord.appendChild(this.lr);
    this.lr.style.fontSize = "3vh";
    recordContainer.style.top = "15%";
  },

  menu: function () {
    document.location.reload(false);
  },
  reload: function () {
    document.getElementById("reload-btn").disabled = true;
    recordContainer.style.top = "-100%";
    game.platform.w = game.pixel * 8;
    game.bricks = [];
    game.score = 0;
    game.running = true;
    game.hearts = 3;
    game.ball.startBall();
    game.start();
  },
};
