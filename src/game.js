function Game() {
  var _this = this;
  this.STATES = {
    LOADING: "loading",
    PLAYING: "playing",
    READY: "ready",
    ENDED: "ended",
    RESETTING: "resetting",
  };
  this.blocks = [];
  this.state = this.STATES.LOADING;
  this.stage = new Stage();
  this.mainContainer = document.getElementById("container");
  this.scoreContainer = document.getElementById("score");
  this.startButton = document.getElementById("start-button");
  this.instructions = document.getElementById("instructions");
  this.scoreContainer.innerHTML = "0";
  this.newBlocks = new THREE.Group();
  this.placedBlocks = new THREE.Group();
  this.choppedBlocks = new THREE.Group();
  this.stage.add(this.newBlocks);
  this.stage.add(this.placedBlocks);
  this.stage.add(this.choppedBlocks);
  this.addBlock();
  this.tick();
  this.updateState(this.STATES.READY);
  document.addEventListener("keydown", function (e) {
    if (e.keyCode == 32) _this.onAction();
  });
  document.addEventListener("click", function (e) {
    _this.onAction();
  });
  document.addEventListener("touchstart", function (e) {
    e.preventDefault();
    // this.onAction();
    // ☝️ this triggers after click on android so you
    // insta-lose, will figure it out later.
  });
}
Game.prototype.updateState = function (newState) {
  for (var key in this.STATES) this.mainContainer.classList.remove(this.STATES[key]);
  this.mainContainer.classList.add(newState);
  this.state = newState;
};
Game.prototype.onAction = function () {
  switch (this.state) {
    case this.STATES.READY:
      this.startGame();
      break;
    case this.STATES.PLAYING:
      this.placeBlock();
      break;
    case this.STATES.ENDED:
      this.restartGame();
      break;
  }
};
Game.prototype.startGame = function () {
  if (this.state != this.STATES.PLAYING) {
    this.scoreContainer.innerHTML = "0";
    this.updateState(this.STATES.PLAYING);
    this.addBlock();
  }
};
Game.prototype.restartGame = function () {
  var _this = this;
  this.updateState(this.STATES.RESETTING);
  var oldBlocks = this.placedBlocks.children;
  var removeSpeed = 0.2;
  var delayAmount = 0.02;
  var _loop_1 = function (i) {
    TweenLite.to(oldBlocks[i].scale, removeSpeed, {
      x: 0,
      y: 0,
      z: 0,
      delay: (oldBlocks.length - i) * delayAmount,
      ease: Power1.easeIn,
      onComplete: function () {
        return _this.placedBlocks.remove(oldBlocks[i]);
      },
    });
    TweenLite.to(oldBlocks[i].rotation, removeSpeed, {
      y: 0.5,
      delay: (oldBlocks.length - i) * delayAmount,
      ease: Power1.easeIn,
    });
  };
  for (var i = 0; i < oldBlocks.length; i++) {
    _loop_1(i);
  }
  var cameraMoveSpeed = removeSpeed * 2 + oldBlocks.length * delayAmount;
  this.stage.setCamera(2, cameraMoveSpeed);
  var countdown = { value: this.blocks.length - 1 };
  TweenLite.to(countdown, cameraMoveSpeed, {
    value: 0,
    onUpdate: function () {
      _this.scoreContainer.innerHTML = String(Math.round(countdown.value));
    },
  });
  this.blocks = this.blocks.slice(0, 1);
  setTimeout(function () {
    _this.startGame();
  }, cameraMoveSpeed * 1000);
};
Game.prototype.placeBlock = function () {
  var _this = this;
  var currentBlock = this.blocks[this.blocks.length - 1];
  var newBlocks = currentBlock.place();
  this.newBlocks.remove(currentBlock.mesh);
  if (newBlocks.placed) this.placedBlocks.add(newBlocks.placed);
  if (newBlocks.chopped) {
    this.choppedBlocks.add(newBlocks.chopped);
    var positionParams = {
      y: "-=30",
      ease: Power1.easeIn,
      onComplete: function () {
        return _this.choppedBlocks.remove(newBlocks.chopped);
      },
    };
    var rotateRandomness = 10;
    var rotationParams = {
      delay: 0.05,
      x: newBlocks.plane == "z" ? Math.random() * rotateRandomness - rotateRandomness / 2 : 0.1,
      z: newBlocks.plane == "x" ? Math.random() * rotateRandomness - rotateRandomness / 2 : 0.1,
      y: Math.random() * 0.1,
    };
    if (newBlocks.chopped.position[newBlocks.plane] > newBlocks.placed.position[newBlocks.plane]) {
      positionParams[newBlocks.plane] = "+=" + 40 * Math.abs(newBlocks.direction);
    } else {
      positionParams[newBlocks.plane] = "-=" + 40 * Math.abs(newBlocks.direction);
    }
    TweenLite.to(newBlocks.chopped.position, 1, positionParams);
    TweenLite.to(newBlocks.chopped.rotation, 1, rotationParams);
  }
  this.addBlock();
};
Game.prototype.addBlock = function () {
  var lastBlock = this.blocks[this.blocks.length - 1];
  if (lastBlock && lastBlock.state == lastBlock.STATES.MISSED) {
    return this.endGame();
  }
  this.scoreContainer.innerHTML = String(this.blocks.length - 1);
  var newKidOnTheBlock = new Block(lastBlock);
  this.newBlocks.add(newKidOnTheBlock.mesh);
  this.blocks.push(newKidOnTheBlock);
  this.stage.setCamera(this.blocks.length * 2);
  if (this.blocks.length >= 5) this.instructions.classList.add("hide");
};
Game.prototype.endGame = function () {
  this.updateState(this.STATES.ENDED);
};
Game.prototype.tick = function () {
  var _this = this;
  this.blocks[this.blocks.length - 1].tick();
  this.stage.render();
  requestAnimationFrame(function () {
    _this.tick();
  });
};
