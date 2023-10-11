//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { MyAxis } from './MyAxis.js';
//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
let container = document.getElementById("container3D");
const camera = new THREE.PerspectiveCamera(80, container.clientWidth / container.clientHeight, 0.1, 1000);

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
    object.rotation.set(0, 0, 0);
    //object.scale.set(1.5, 0.2, 1.5);
    object.position.set(0, 0.3, 0.2);
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);


camera.position.set(-1.4, 0.7, 1.3); // Adjust the camera position
camera.lookAt(0, 0, 0); // Look at the origin (0, 0, 0)


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true , antialias: true });
renderer.setPixelRatio(window.devicePixelRatio); // This line is important!
container = document.getElementById("container3D");
renderer.setSize(container.clientWidth, container.clientHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);


//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(2, 2, 2) //top-left-ish
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 2);
scene.add(ambientLight);

//let axis = new MyAxis();
//scene.add(axis);

// Set up target rotation variables
let targetRotationX = 0;
let targetRotationY = -0.5;

// Define a lerp factor. Values closer to 0 will make the rotation adjust more slowly.
const lerpFactor = 0.02;

// Variables for oscillation
let time = 0;
const amplitudeX = 0.02;  // Maximum angle of oscillation in radians for X-axis
const frequencyX = 0.5;  // Speed of oscillation for X-axis

const amplitudeY = 0.04;  // Maximum angle of oscillation in radians for Y-axis
const frequencyY = 0.6;  // Speed of oscillation for Y-axis

function animate() {
  requestAnimationFrame(animate);

  // Oscillate the targetRotationX and targetRotationY values
  targetRotationX = amplitudeX * Math.sin(time * frequencyX);
  targetRotationY = -0.5 + amplitudeY * Math.sin(time * frequencyY); // Added oscillation to the Y rotation
  
  if (objToRender === "phone") {
    // Adjust target rotation value for Y based on mouse position
    targetRotationY += mouseX * 1 / (window.innerWidth * 2);

    // Use lerp to smoothly adjust the rotation
    object.rotation.y += (targetRotationY - object.rotation.y) * lerpFactor;
    object.rotation.x += (targetRotationX - object.rotation.x) * lerpFactor;
  }

  time += 0.01; // Increment time

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