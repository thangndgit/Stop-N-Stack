class Game {
  constructor() {
    this.STATES = {
      LOADING: "loading",
      PLAYING: "playing",
      READY: "ready",
      ENDED: "ended",
      RESETTING: "resetting",
    };
    this.difficulty = Number(localStorage.getItem(KEYS.difficultLevel)) || 1;
    this.blocks = [];
    this.state = this.STATES.LOADING;
    this.stage = new Stage();
    this.mainContainer = document.getElementById("container");
    this.scoreContainer = document.getElementById("score");
    this.startButton = document.getElementById("start-button");
    this.instructions = document.getElementById("instructions");
    this.gameResult1 = document.getElementById("game-result-1");
    this.gameResult2 = document.getElementById("game-result-2");
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

    // Event listeners
    document.addEventListener("keydown", (e) => {
      if (e.keyCode == 32) this.onAction();
    });

    document.addEventListener("click", (e) => {
      const invalidTags = ["svg", "path", "polygon", "line", "BUTTON", "SPAN"];
      if (invalidTags.includes(e.target.tagName)) return;
      this.onAction();
    });

    document.addEventListener("touchstart", (e) => {
      const invalidTags = ["svg", "path", "polygon", "line", "BUTTON", "SPAN"];
      if (invalidTags.includes(e.target.tagName)) return;
      e.preventDefault();
      // this.onAction();
    });
  }

  updateState(newState) {
    // Remove all state classes and add the new state class
    for (let key in this.STATES) {
      this.mainContainer.classList.remove(this.STATES[key]);
    }
    this.mainContainer.classList.add(newState);
    this.state = newState;
  }

  onAction() {
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
  }

  startGame() {
    playSound(SOUNDS.click);
    if (this.state != this.STATES.PLAYING) {
      this.scoreContainer.innerHTML = "0";
      this.updateState(this.STATES.PLAYING);
      this.addBlock();
    }
  }

  restartGame() {
    this.updateState(this.STATES.RESETTING);
    const oldBlocks = this.placedBlocks.children;
    const removeSpeed = 0.2;
    const delayAmount = 0.02;

    for (let i = 0; i < oldBlocks.length; i++) {
      TweenLite.to(oldBlocks[i].scale, removeSpeed, {
        x: 0,
        y: 0,
        z: 0,
        delay: (oldBlocks.length - i) * delayAmount,
        ease: Power1.easeIn,
        onComplete: () => this.placedBlocks.remove(oldBlocks[i]),
      });

      TweenLite.to(oldBlocks[i].rotation, removeSpeed, {
        y: 0.5,
        delay: (oldBlocks.length - i) * delayAmount,
        ease: Power1.easeIn,
      });
    }

    const cameraMoveSpeed = removeSpeed * 2 + oldBlocks.length * delayAmount;
    this.stage.setCamera(2, cameraMoveSpeed);
    const countdown = { value: this.blocks.length - 1 };

    TweenLite.to(countdown, cameraMoveSpeed, {
      value: 0,
      onUpdate: () => {
        this.scoreContainer.innerHTML = String(Math.round(countdown.value));
      },
    });

    this.blocks = this.blocks.slice(0, 1);

    setTimeout(() => {
      this.startGame();
    }, cameraMoveSpeed * 1000);
  }

  placeBlock() {
    const currentBlock = this.blocks[this.blocks.length - 1];
    const newBlocks = currentBlock.place();

    this.newBlocks.remove(currentBlock.mesh);

    if (newBlocks.placed) {
      this.placedBlocks.add(newBlocks.placed);
    }

    if (newBlocks.chopped) {
      this.choppedBlocks.add(newBlocks.chopped);

      const positionParams = {
        y: "-=30",
        ease: Power1.easeIn,
        onComplete: () => this.choppedBlocks.remove(newBlocks.chopped),
      };

      const rotateRandomness = 10;
      const rotationParams = {
        delay: 0.05,
        x: newBlocks.plane == "z" ? Math.random() * rotateRandomness - rotateRandomness / 2 : 0.1,
        z: newBlocks.plane == "x" ? Math.random() * rotateRandomness - rotateRandomness / 2 : 0.1,
        y: Math.random() * 0.1,
      };

      if (newBlocks.chopped.position[newBlocks.plane] > newBlocks.placed.position[newBlocks.plane]) {
        positionParams[newBlocks.plane] = `+=${40 * Math.abs(newBlocks.direction)}`;
      } else {
        positionParams[newBlocks.plane] = `-=${40 * Math.abs(newBlocks.direction)}`;
      }

      TweenLite.to(newBlocks.chopped.position, 1, positionParams);
      TweenLite.to(newBlocks.chopped.rotation, 1, rotationParams);
    }

    this.addBlock();
  }

  addBlock() {
    const lastBlock = this.blocks[this.blocks.length - 1];

    if (lastBlock && lastBlock.state == lastBlock.STATES.MISSED) {
      return this.endGame();
    }

    this.scoreContainer.innerHTML = String(this.blocks.length - 1);

    const newKidOnTheBlock = new Block(lastBlock, this.difficulty);
    this.newBlocks.add(newKidOnTheBlock.mesh);
    this.blocks.push(newKidOnTheBlock);

    this.stage.setCamera(this.blocks.length * 2);

    if (this.blocks.length >= 5) {
      this.instructions.classList.add("hide");
    }
  }

  endGame() {
    this.updateState(this.STATES.ENDED);

    const score = Number(this.scoreContainer.innerHTML);
    const difficultLevel = Number(localStorage.getItem(KEYS.difficultLevel)) || 1;
    const stats = JSON.parse(localStorage.getItem(KEYS.stats)) || {
      easy: {
        highScore: 0,
        attempt: 0,
        totalScore: 0,
      },
      medium: {
        highScore: 0,
        attempt: 0,
        totalScore: 0,
      },
      hard: {
        highScore: 0,
        attempt: 0,
        totalScore: 0,
      },
    };
    const difficultLabel = DIFFICULT_LABELS[difficultLevel];
    const highScore = stats[difficultLabel].highScore;

    if (score > highScore) {
      setTimeout(() => {
        playSound(SOUNDS.breakRecord, 0.35);
      }, 500);
      this.gameResult1.innerHTML = "Congratulations!";
      this.gameResult2.innerHTML = "You have broken your own record!";
      stats[difficultLabel].highScore = score;
    } else if (score >= highScore / 2 && highScore - score < 10) {
      this.gameResult1.innerHTML = `You're about to break the record!`;
      this.gameResult2.innerHTML = `${highScore - score + 1} more ${
        highScore === score ? "stack" : "stacks"
      } and you will get it!`;
    } else {
      const textSamples = [
        `Let's give it another try!`,
        `I believe you can do better!`,
        `I believe it was just an accident!`,
      ];
      const randomIndex = Math.floor(Math.random() * 3);
      this.gameResult1.innerHTML = textSamples[randomIndex];
      this.gameResult2.innerHTML = "";
    }

    stats[difficultLabel].attempt++;
    stats[difficultLabel].totalScore += score;
    localStorage.setItem(KEYS.stats, JSON.stringify(stats));
  }

  tick() {
    this.blocks[this.blocks.length - 1].tick();
    this.stage.render();

    requestAnimationFrame(() => {
      this.tick();
    });
  }
}

let game = new Game();
