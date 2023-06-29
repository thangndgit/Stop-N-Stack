class Stage {
  constructor(containerId = "game") {
    // _this pointer to use in prototype
    var _this = this; // Conventional way to access 'this' inside nested functions

    // Get the container element by ID
    this.container = document.getElementById(containerId);

    // Create a WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor("#D0CBC7", 1);
    this.container.appendChild(this.renderer.domElement);

    // Create a scene
    this.scene = new THREE.Scene();

    // Create a camera
    const aspect = window.innerWidth / window.innerHeight;
    const d = 20;
    this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, -100, 1000);
    this.camera.position.x = 2;
    this.camera.position.y = 2;
    this.camera.position.z = 2;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create lights
    this.light = new THREE.DirectionalLight(0xffffff, 0.5);
    this.light.position.set(0, 100, 0);
    this.scene.add(this.light);

    this.softLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.softLight);

    // Handle window resize
    window.addEventListener("resize", function () {
      return _this.onResize();
    });
    this.onResize();
  }

  // Render the scene
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  // Add an element to the scene
  add(elem) {
    this.scene.add(elem);
  }

  // Remove an element from the scene
  remove(elem) {
    this.scene.remove(elem);
  }

  // Set the camera position
  setCamera(y, speed = 0.3) {
    // Move the camera to the specified position
    // The camera's lookAt position is also updated
    TweenLite.to(this.camera.position, speed, { y: y + 4, ease: Power1.easeInOut });
    TweenLite.to(this.camera.lookAt, speed, { y: y, ease: Power1.easeInOut });
  }

  // Handle window resize event
  onResize() {
    let viewSize = 30;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Update camera projection based on the new window size
    this.camera.left = window.innerWidth / -viewSize;
    this.camera.right = window.innerWidth / viewSize;
    this.camera.top = window.innerHeight / viewSize;
    this.camera.bottom = window.innerHeight / -viewSize;
    this.camera.updateProjectionMatrix();
  }
}
