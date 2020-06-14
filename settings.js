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
      game.brickCountX = rx.value;
      game.brickCountY = ry.value;
      setTimeout(function () {
        game.start();
      }, 700);
    }
  },
};
