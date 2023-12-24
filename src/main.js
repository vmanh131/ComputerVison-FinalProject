import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { coralDict, loadModelAtPath } from './modules/load_models.js';
import { createScene } from './modules/createScene.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';


var scene = createScene();
const stats = new Stats();
document.body.appendChild(stats.dom);

const coralGroup = new THREE.Group();
//var scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    10000
);
camera.position.z = 10;

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
//renderer.setClearColor(0x000011, 1);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor( 0x0fe7ff, 1 );

const controls = new OrbitControls(camera, renderer.domElement );


var init = function () {
    // initUIController(onEditCallback, onViewCallback);

    // loadModelAtPath('models/coral_1_4/scene.gltf', scene, 0);
    // loadModelAtPath('models/coral_5_8/scene.gltf', scene, 1);
    // loadModelAtPath('models/coral_9_13/scene.gltf', scene, 2);
    // loadModelAtPath('models/coral_14_17/scene.gltf', scene, 3);
    // loadModelAtPath('models/coral_18_23/scene.gltf', scene, 4);
    // loadModelAtPath('models/coral_24_27/scene.gltf', scene, 5);
    // loadModelAtPath('models/coral_27_30/scene.gltf', scene, 6);

    // initCoralPallete();
}

// Render Loop
var render = function () {
    requestAnimationFrame( render );
    // Your animated code goes here
    renderer.render(scene, camera);
    TWEEN.update();

    stats.update();
    //editUpdate(scene, camera, coralDict);
    //editUpdate();
};


init();
render();