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
    if (callresult.error != undefined) alert(callresult.error);
    else {
      $.ajax({
        url: this.ajaxHandlerScript,
        type: "POST",
        cache: false,
        dataType: "json",
        data: {
          f: "UPDATE",
          n: this.stringName,
          v: JSON.stringify(recordsAjax.topGamer),
          p: this.updatePassword,
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
    if (callresult.error != undefined) alert(callresult.error);
    else if (callresult.result != "") {
      console.log(JSON.parse(callresult.result));
      this.topGamer = JSON.parse(callresult.result);
      console.log(this.topGamer);
      recordsAjax.comparison(this.topGamer);
    }
  },

  errorHandler: function (jqXHR, statusStr, errorStr) {
    alert(statusStr + " " + errorStr);
  },

  comparison: function (top) {
    console.log(top);
    if (game.score > top.score) {
      top.name = settings.userName;
      top.score = game.score;

      this.storeInfo();
    }
  },
};
