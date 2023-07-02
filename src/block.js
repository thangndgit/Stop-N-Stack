class Block {
  constructor(block, speedLevel = 1) {
    // Set size and position
    this.MOVE_AMOUNT = 12;
    this.STATES = { ACTIVE: "active", STOPPED: "stopped", MISSED: "missed" };
    this.dimension = { width: 0, height: 0, depth: 0 };
    this.position = { x: 0, y: 0, z: 0 };
    this.targetBlock = block;
    this.index = (this.targetBlock ? this.targetBlock.index : 0) + 1;
    this.workingPlane = this.index % 2 ? "x" : "z";
    this.workingDimension = this.index % 2 ? "width" : "depth";

    // Set the dimensions from the target block, or use defaults
    this.dimension.width = this.targetBlock ? this.targetBlock.dimension.width : 10;
    this.dimension.height = this.targetBlock ? this.targetBlock.dimension.height : 2;
    this.dimension.depth = this.targetBlock ? this.targetBlock.dimension.depth : 10;
    this.position.x = this.targetBlock ? this.targetBlock.position.x : 0;
    this.position.y = this.dimension.height * this.index;
    this.position.z = this.targetBlock ? this.targetBlock.position.z : 0;
    this.colorOffset = this.targetBlock ? this.targetBlock.colorOffset : Math.round(Math.random() * 100);
    this.perfectCount = this.targetBlock ? this.targetBlock.perfectCount : 0;

    // Set color
    if (!this.targetBlock) {
      this.color = 0x333344;
    } else {
      const offset = this.index + this.colorOffset;
      const r = Math.sin(0.3 * offset) * 55 + 200;
      const g = Math.sin(0.3 * offset + 2) * 55 + 200;
      const b = Math.sin(0.3 * offset + 4) * 55 + 200;
      this.color = new THREE.Color(r / 255, g / 255, b / 255);
    }

    // Set state
    this.state = this.index > 1 ? this.STATES.ACTIVE : this.STATES.STOPPED;

    // Set direction
    this.speed = -0.1 - this.index * 0.004 * speedLevel;
    if (this.speed < -4) this.speed = -4;
    this.direction = this.speed;

    // Create a geometry for the block
    const geometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
    // Apply a translation matrix to the geometry to center it
    geometry.applyMatrix(
      new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2)
    );

    // Create mesh object
    this.material = new THREE.MeshToonMaterial({ color: this.color, flatShading: false });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);

    // If the block is in the active state, randomly move the block along the specified working plane
    if (this.state == this.STATES.ACTIVE) {
      this.position[this.workingPlane] = Math.random() > 0.5 ? -this.MOVE_AMOUNT : this.MOVE_AMOUNT;
    }
  }

  // Reverse the direction of the block
  reverseDirection() {
    this.direction = this.direction > 0 ? this.speed : Math.abs(this.speed);
  }

  // Place the block in the scene
  place() {
    // Set the state to STOPPED
    this.state = this.STATES.STOPPED;

    // Calculate the overlap between the current block and the target block
    let overlap =
      this.targetBlock.dimension[this.workingDimension] -
      Math.abs(this.position[this.workingPlane] - this.targetBlock.position[this.workingPlane]);

    // Create an object to store information about the placed and chopped blocks
    const blocksToReturn = {
      plane: this.workingPlane,
      direction: this.direction,
    };

    // Check if the overlap is less than a threshold value
    if (this.dimension[this.workingDimension] - overlap < 0.3) {
      // If the overlap is small, consider it as a bonus and merge the blocks
      overlap = this.dimension[this.workingDimension];
      blocksToReturn.bonus = true;
      this.position.x = this.targetBlock.position.x;
      this.position.z = this.targetBlock.position.z;
      this.dimension.width = this.targetBlock.dimension.width;
      this.dimension.depth = this.targetBlock.dimension.depth;
      this.perfectCount = this.perfectCount + 1;
    } else {
      this.perfectCount = 0;
    }

    // Check if there is any overlap between the blocks
    if (overlap > 0) {
      // Calculate the dimensions of the chopped block
      const choppedDimensions = {
        width: this.dimension.width,
        height: this.dimension.height,
        depth: this.dimension.depth,
      };
      choppedDimensions[this.workingDimension] -= overlap;

      // Update the dimensions of the current block
      this.dimension[this.workingDimension] = overlap;

      // Create the geometry for the placed block
      const placedGeometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
      placedGeometry.applyMatrix(
        new THREE.Matrix4().makeTranslation(
          this.dimension.width / 2,
          this.dimension.height / 2,
          this.dimension.depth / 2
        )
      );
      const placedMesh = new THREE.Mesh(placedGeometry, this.material);

      // Create the geometry for the chopped block
      const choppedGeometry = new THREE.BoxGeometry(
        choppedDimensions.width,
        choppedDimensions.height,
        choppedDimensions.depth
      );
      choppedGeometry.applyMatrix(
        new THREE.Matrix4().makeTranslation(
          choppedDimensions.width / 2,
          choppedDimensions.height / 2,
          choppedDimensions.depth / 2
        )
      );
      const choppedMesh = new THREE.Mesh(choppedGeometry, this.material);

      // Calculate the position of the chopped block
      const choppedPosition = {
        x: this.position.x,
        y: this.position.y,
        z: this.position.z,
      };
      // If the current block is positioned before the target block, update the position of the current block
      if (this.position[this.workingPlane] < this.targetBlock.position[this.workingPlane]) {
        this.position[this.workingPlane] = this.targetBlock.position[this.workingPlane];
      }
      // If the current block is positioned after the target block, update the position of the chopped block
      else {
        choppedPosition[this.workingPlane] += overlap;
      }

      // Set the positions of the placed and chopped blocks
      placedMesh.position.set(this.position.x, this.position.y, this.position.z);
      choppedMesh.position.set(choppedPosition.x, choppedPosition.y, choppedPosition.z);

      // Store the placed and chopped blocks in the object
      blocksToReturn.placed = placedMesh;
      if (!blocksToReturn.bonus) blocksToReturn.chopped = choppedMesh;

      // Play sound

      if (this.perfectCount) playSound(SOUNDS.score[Math.min(this.perfectCount, 8)]);
      else playSound(SOUNDS.score[0]);
    }
    // If there is no overlap, set the state to MISSED
    else {
      playSound(SOUNDS.miss);
      this.state = this.STATES.MISSED;
    }

    // Update the dimension of the current block
    this.dimension[this.workingDimension] = overlap;

    // Return the object containing information about the placed and chopped blocks
    return blocksToReturn;
  }

  // Update the position of the block
  tick() {
    if (this.state == this.STATES.ACTIVE) {
      const value = this.position[this.workingPlane];
      // If the position value exceeds the allowed movement range, reverse the direction.
      if (value > this.MOVE_AMOUNT || value < -this.MOVE_AMOUNT) {
        this.reverseDirection();
      }
      this.position[this.workingPlane] += this.direction;
      this.mesh.position[this.workingPlane] = this.position[this.workingPlane];
    }
  }
}
