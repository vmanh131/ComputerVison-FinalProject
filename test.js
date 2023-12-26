import * as THREE from 'three';
//import * as YUKA from 'yuka';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const grid = new THREE.GridHelper( 100, 50 );
scene.add( grid );

let object;
let turtle;

let controls;

const loader = new GLTFLoader();
const clock = new THREE.Clock();
let mixer;
var mixers = [];  
var basePath = './3DModel/'; 

var models = [
  //{ name: 'schoolfish', position: { x: -6.5, y: -7, z: 6 }, rotation: -Math.PI/4, scale: 20 },
  //{ name: 'turtle', position: { x: -4.5, y: -5, z: 4 }, rotation: Math.PI, scale: 20 },
 // { name: 'shark', position: { x: 5, y: -5, z: 4 }, rotation: Math.PI/4, scale: 20 },
  // { name: 'octopus', position: { x: 5, y: -5, z: 4 }, rotation: Math.PI/4, scale: 200 },
  { name: 'dolphin', position: { x: 5, y: -5, z: 4 }, rotation: Math.PI/1.5, scale: 20 },
  { name: 'clown_fish', position: { x: 5, y: 5, z: 4 }, rotation: Math.PI/1.5, scale: 0.2 },
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
      mixer = new THREE.AnimationMixer(object);
      mixers.push(mixer);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    },
  );
});


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

 camera.position.z = 100;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.AmbientLight(0xffffff); // (color, intensity)
//topLight.position.set(1000, 1000, 1000) //top-left-ish
//topLight.castShadow = true;
scene.add(topLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
controls = new OrbitControls(camera, renderer.domElement);


//Render the scene
function animate() {
  requestAnimationFrame(animate);

  var delta = clock.getDelta(); // Lấy thời gian đã trôi qua từ lần cuối cùng hàm này được gọi

//   for (var i = 0; i < mixers.length; i++) { // Cập nhật tất cả các mixer
//     mixers[i]._root.position.x += Math.sin(delta) * (Math.random() - 0.5) * 0.1;
//     mixers[i]._root.position.y += Math.sin(delta) * (Math.random() - 0.5) * 0.1;
//     mixers[i]._root.position.z += Math.sin(delta) * (Math.random() - 0.5) * 0.1;
//     mixers[i].update(delta);
    
//   }
for (var i = 0; i < mixers.length; i++) { // Cập nhật tất cả các mixer
    var mixer = mixers[i];
    mixer.update(delta);

    // Tạo một vận tốc ngẫu nhiên cho mỗi mixer
    var velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    );

    // Cập nhật vị trí của mixer dựa trên vận tốc
    mixer._root.position.add(velocity.multiplyScalar(delta));
  }
  // const delta = clock.getDelta();
  // mixer.update(delta);
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}

animate();