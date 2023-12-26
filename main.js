// import * as THREE from 'three';
// import * as YUKA from 'yuka';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';


// const renderer = new THREE.WebGLRenderer({alpha: true});

// renderer.setSize(window.innerWidth, window.innerHeight);

// document.body.appendChild(renderer.domElement);

// const scene = new THREE.Scene();

// renderer.setClearColor(0xffffff);

// const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
// );

// camera.position.set(0, 10, 0);
// camera.lookAt(scene.position);
// let controls;
// controls = new OrbitControls(camera, renderer.domElement);
// // const vehicleGeometry = new THREE.ConeGeometry(0.1, 0.5, 8);
// // vehicleGeometry.rotateX(Math.PI * 0.5);
// // const vehicleMaterial = new THREE.MeshNormalMaterial();
// // const vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
// // vehicleMesh.matrixAutoUpdate = false;
// // scene.add(vehicleMesh);

// // const vehicle = new YUKA.Vehicle();
// // vehicle.setRenderComponent(vehicleMesh, sync);
// //const vehicle = new YUKA.Vehicle();
// const loader = new GLTFLoader();
// const entityManager = new YUKA.EntityManager();
// function sync(entity, renderComponent) {
//     renderComponent.matrix.copy(entity.worldMatrix);
// }


// let mixer;
// loader.load('./3DModel/shark/scene.gltf', function (gltf)
// {
//         const object = gltf.scene;
//         const clips = gltf.animations;
//         const fishes = new THREE.AnimationObjectGroup();
//         mixer = new THREE.AnimationMixer(fishes);
//         const clip = clips.find(clip => clip.name === 'Action');
//         //const clip = new THREE.AnimationClip.findByName(clips, 'Action');
//         var action = mixer.clipAction(clip);
//         action.play();
//       for (let i = 0; i < 5; i++){
        
//         var fishClone = SkeletonUtils.clone(object);
//         fishClone.matrixAutoUpdate = false;
        
        
//         //object.position.set(model.position.x, model.position.y, model.position.z);
//         //object.rotation.y = - Math.PI/2;   
//         scene.add(fishClone);
//         fishes.add(fishClone);

//         const vehicle = new YUKA.Vehicle();
//         vehicle.scale = new YUKA.Vector3(0.5, 0.5, 0.5);
//         vehicle.setRenderComponent(fishClone, sync);

//         const wanderBehavior = new YUKA.WanderBehavior();
//         vehicle.steering.add(wanderBehavior);

//         entityManager.add(vehicle);

//         vehicle.position.x = 2.5 - Math.random() * 5;
//         vehicle.position.z = 2.5 - Math.random() * 5;
//         vehicle.rotation.fromEuler(0, 2 * Math.PI * Math.random(), 0)
//         // var mixer = new THREE.AnimationMixer(object);
//         // mixers.push(mixer);
//         // gltf.animations.forEach((clip) => {
//         //   mixer.clipAction(clip).play();
//         // });

        
//         //vehicle.setRenderComponent(fishClone, sync);
//       }
// }  
// )  

// // const path = new YUKA.Path();
// // path.add( new YUKA.Vector3(-4, 0, 4));
// // path.add( new YUKA.Vector3(-6, 0, 0));
// // path.add( new YUKA.Vector3(-4, 0, -4));
// // path.add( new YUKA.Vector3(0, 0, 0));
// // path.add( new YUKA.Vector3(4, 0, -4));
// // path.add( new YUKA.Vector3(6, 0, 0));
// // path.add( new YUKA.Vector3(4, 0, 4));
// // path.add( new YUKA.Vector3(0, 0, 6));

// // path.loop = true;

// // vehicle.position.copy(path.current());

// // //vehicle.maxSpeed = 3;

// // const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.5);
// // vehicle.steering.add(followPathBehavior);

// // const onPathBehavior = new YUKA.OnPathBehavior(path);
// // onPathBehavior.radius = 2;
// // vehicle.steering.add(onPathBehavior);

// // const entityManager = new YUKA.EntityManager();
// // entityManager.add(vehicle);

// // const position = [];
// // for(let i = 0; i < path._waypoints.length; i++) {
// //     const waypoint = path._waypoints[i];
// //     position.push(waypoint.x, waypoint.y, waypoint.z);
// // }

// // const lineGeometry = new THREE.BufferGeometry();
// // lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

// // const lineMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF});
// // const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
// // scene.add(lines);

// const time = new YUKA.Time();
// const clock = new THREE.Clock();

// const ambientLight = new THREE.AmbientLight(0xfffffff, 2);
// scene.add(ambientLight);


// function animate() {
//     const clockDelta = clock.getDelta();
//     if(mixer)
//         mixer.update(clockDelta);
//     const delta = time.update().getDelta();
//     entityManager.update(delta);
//     renderer.render(scene, camera);
// }

// renderer.setAnimationLoop(animate);

// window.addEventListener('resize', function() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });


import * as THREE from 'three';
import * as YUKA from 'yuka';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

renderer.setClearColor(0xA3A3A3);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 10, 15);
camera.lookAt(scene.position);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

const vehicle = new YUKA.Vehicle();

function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix);
}

const path = new YUKA.Path();
path.add( new YUKA.Vector3(-6, 0, 4));
path.add( new YUKA.Vector3(-12, 0, 0));
path.add( new YUKA.Vector3(-6, 0, -12));
path.add( new YUKA.Vector3(0, 0, 0));
path.add( new YUKA.Vector3(8, 0, -8));
path.add( new YUKA.Vector3(10, 0, 0));
path.add( new YUKA.Vector3(4, 0, 4));
path.add( new YUKA.Vector3(0, 0, 6));

path.loop = true;

vehicle.position.copy(path.current());

vehicle.maxSpeed = 3;

const followPathBehavior = new YUKA.FollowPathBehavior(path, 3);
vehicle.steering.add(followPathBehavior);

const onPathBehavior = new YUKA.OnPathBehavior(path);
//onPathBehavior.radius = 2;
vehicle.steering.add(onPathBehavior);

const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);


const loader = new GLTFLoader();
loader.load('./3DModel/shark/scene.gltf', function(gltf) {
    const model = gltf.scene;
    //model.rotation.y = - Math.PI;
    scene.add(model);
    model.matrixAutoUpdate = false;
    vehicle.scale = new YUKA.Vector3(2, 2, 2);
    vehicle.setRenderComponent(model, sync);
});

// const vehicleGeometry = new THREE.ConeBufferGeometry(0.1, 0.5, 8);
// vehicleGeometry.rotateX(Math.PI * 0.5);
// const vehicleMaterial = new THREE.MeshNormalMaterial();
// const vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
// vehicleMesh.matrixAutoUpdate = false;
// scene.add(vehicleMesh);

const position = [];
for(let i = 0; i < path._waypoints.length; i++) {
    const waypoint = path._waypoints[i];
    position.push(waypoint.x, waypoint.y, waypoint.z);
}

const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

const lineMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF});
const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
scene.add(lines);

const time = new YUKA.Time();

function animate() {
    const delta = time.update().getDelta();
    entityManager.update(delta);
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});