//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep the 3D object on a global variable so we can access it later
let object;
let turtle;

//OrbitControls allow the camera to move around the scene
let controls;

const loader = new GLTFLoader();
const clock = new THREE.Clock();
var mixers = [];  
var basePath = './3DModel/'; 

var models = [
  { name: 'schoolfish', position: { x: -6.5, y: -7, z: 6 }, rotation: -Math.PI/4, scale: 20 },
  { name: 'turtle', position: { x: -4.5, y: -5, z: 4 }, rotation: Math.PI, scale: 20 },
  { name: 'shark', position: { x: 5, y: -5, z: 4 }, rotation: Math.PI/4, scale: 20 },
  // { name: 'octopus', position: { x: 5, y: -5, z: 4 }, rotation: Math.PI/4, scale: 200 },
  { name: 'dolphin', position: { x: 5, y: -5, z: 4 }, rotation: Math.PI/1.5, scale: 20 },
];

models.forEach(model => {
  loader.load(
    basePath + model.name + '/scene.gltf',
    function (gltf) {
      var object = gltf.scene;
      object.scale.set(model.scale, model.scale, model.scale);
      object.position.set(model.position.x, model.position.y, model.position.z);
      object.rotation.y = model.rotation;
      scene.add(object);
      var mixer = new THREE.AnimationMixer(object);
      mixers.push(mixer);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error(error);
    }
  );
});


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// //Set how far the camera will be from the 3D model
 camera.position.z = 100;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 2); // (color, intensity)
topLight.position.set(1000, 1000, 1000) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

// const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
// scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
controls = new OrbitControls(camera, renderer.domElement);


//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  var delta = clock.getDelta(); // Lấy thời gian đã trôi qua từ lần cuối cùng hàm này được gọi

  for (var i = 0; i < mixers.length; i++) { // Cập nhật tất cả các mixer
    mixers[i].update(delta);
  }
  // const delta = clock.getDelta();
  // mixer.update(delta);
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
// window.addEventListener("resize", function () {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// //add mouse position listener, so we can make the eye move
// document.onmousemove = (e) => {
//   mouseX = e.clientX;
//   mouseY = e.clientY;
// }

//Start the 3D rendering
animate();