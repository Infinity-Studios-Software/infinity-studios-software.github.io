  //Import the THREE.js library
  import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
  import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
  import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
  import { MyAxis } from './MyAxis.js';

(function tryLoading() {
  // Check the body width first
  if (document.body.clientWidth < 768) {
      
      // Retry after 2 seconds
      setTimeout(tryLoading, 2000);
      return;
  }

  //Create a Three.JS Scene
  const scene = new THREE.Scene();
  //create a new camera with positions and angles
  let container = document.getElementById("container3D");
  const camera = new THREE.PerspectiveCamera(64, container.clientWidth / container.clientHeight, 0.1, 1000);

  //Keep track of the mouse position, so we can make the eye move
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  //Keep the 3D object on a global variable so we can access it later
  let object;

  //OrbitControls allow the camera to move around the scene
  let controls;

  //Set which object to render
  let objToRender = 'phone';

  //Instantiate a loader for the .gltf file
  const loader = new GLTFLoader();

  //Load the file
  loader.load(
    `models/${objToRender}/scene.gltf`,
    function (gltf) {
      //If the file is loaded, add it to the scene
      object = gltf.scene;
      object.rotation.set(-Math.PI/50, Math.PI*1.25, Math.PI/15);
      object.scale.set(10, 10, 10);
      object.position.set(0, 0.3, 0.2);
      scene.add(object);
      // Hide the loading animation when loading is complete
      const loadingHint = document.getElementById("loading-animation"); // Change "loading-hint" to "loading-animation"
      loadingHint.style.display = "none";
    },
    function (xhr) {
      //While it is loading, log the progress
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      // While it is loading, update the progress bar
      const progressBar = document.querySelector(".progress");
      progressBar.style.width = (xhr.loaded / xhr.total) * 100 + "%";
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      //If there is an error, log it
      console.error(error);
      const loadingAnimation = document.getElementById("loading-animation");
      loadingAnimation.style.display = "none";
    }
  );


  camera.position.set(-1.4, 0.5, 1.3); // Adjust the camera position
  camera.lookAt(0, 0, 0); // Look at the origin (0, 0, 0)


  //Instantiate a new renderer and set its size
  const renderer = new THREE.WebGLRenderer({ alpha: true , antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio); // This line is important!
  container = document.getElementById("container3D");
  renderer.setSize(container.clientWidth, container.clientHeight);


  //Add the renderer to the DOM
  document.getElementById("container3D").appendChild(renderer.domElement);


  //Add lights to the scene, so we can actually see the 3D model
  const topLight = new THREE.DirectionalLight(0xffffff, 0.63); // (color, intensity)
  topLight.position.set(-4.5, 4, 3) //top-left-ish
  scene.add(topLight);

  //Add lights to the scene, so we can actually see the 3D model
  const bottomLight = new THREE.DirectionalLight(0xffffff, 0.49); // (color, intensity)
  bottomLight.position.set(0, 2, 10) //bottom left ish
  scene.add(bottomLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Set up target rotation variables
  let targetRotationX = 0;
  let targetRotationY = -0.5;

  // Define a lerp factor. Values closer to 0 will make the rotation adjust more slowly.
  const lerpFactor = 0.02;

  let time = 0;
  const amplitudeX = 0.01;  // Maximum angle of oscillation in radians for X-axis
  const frequencyX = 1;  // Speed of oscillation for X-axis

  const amplitudeY = 0.06;  // Maximum angle of oscillation in radians for Y-axis
  const frequencyY = 0.7;  // Speed of oscillation for Y-axis

  function animate() {
    requestAnimationFrame(animate);

    if(object != null) {
    // // Oscillate the targetRotationX and targetRotationY values
    targetRotationX = -Math.PI/60 + amplitudeX * Math.sin(time * frequencyX);
    targetRotationY = Math.PI*1.23 + amplitudeY * Math.sin(time * frequencyY); // Added oscillation to the Y rotation
    
    // Adjust target rotation value for Y based on mouse position
    targetRotationY += mouseX * 1 / (window.innerWidth * 3.2);

    // Use lerp to smoothly adjust the rotation
    object.rotation.y += (targetRotationY - object.rotation.y) * lerpFactor;
    object.rotation.x += (targetRotationX - object.rotation.x) * lerpFactor;

    time += 0.01; 
  }

    renderer.render(scene, camera);
  }



  //Add a listener to the window, so we can resize the window and the camera
  window.addEventListener("resize", function () {
    const container = document.getElementById("container3D");
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  animate();

})();