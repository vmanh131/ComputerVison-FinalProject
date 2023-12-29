import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader  } from 'three/addons/loaders/GLTFLoader.js';
import * as TWEEN from '@tweenjs/tween.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

// let noise = new FastNoiseLite();
// noise.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);
const params = {
  threshold: 0,
  strength: .15,
  radius: 0,
  exposure: 1
};

function loadFile(filename) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.FileLoader();

    loader.load(filename, (data) => {
      resolve(data);
    });
  });
}

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.domElement);

const width = window.innerWidth;
const height = window.innerHeight;

// Colors
const black = new THREE.Color('black');
const white = new THREE.Color('white');

// Constants
const waterPosition = new THREE.Vector3(0, 0, 3);
const near = 0.;
const far = 2.;
const waterSize = 512;

// Create Renderer
const scene = new THREE.Scene();
const causticsScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 100);
camera.position.set(-1.5, -1.5, 1);
camera.up.set(0, 0, 1);
scene.add(camera);
causticsScene.add(camera);

const causticsCamera = new THREE.PerspectiveCamera(70, 1, 0.01, 100);
causticsCamera.position.set(-5, 0, 20);
causticsCamera.rotation.set(0, 0, Math.PI / 2);
causticsCamera.up.set(0, 0, 1);
//scene.add(causticsCamera);
causticsScene.add(causticsCamera);

var tween = new TWEEN.Tween(causticsCamera.position);
tween.to({x: 5}, 20000).repeat(Infinity);

tween.start();
//scene.add(causticsGroup);

const cameraHelper = new THREE.CameraHelper(causticsCamera);
//scene.add(cameraHelper);
scene.add(cameraHelper);

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(width, height);
renderer.autoClear = false;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );


const temporaryRenderTarget = new THREE.WebGLRenderTarget(width, height);

// const spotLight = new THREE.DirectionalLight(0xffffff , 1);

const directLightCaustics = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.8 );
const spotLight = new THREE.SpotLight( 0xffffff, 200, 25, 0.53, 1, 1 );
spotLight.position.set( 0, 0, 20 );
// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;
// spotLight.shadow.camera.near = 0.1;
// spotLight.shadow.camera.far = 100;
//spotLight.shadow.focus = 1;


scene.add(spotLight);
causticsScene.add(directLightCaustics)

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// Create mouse Controls
const controls = new OrbitControls(camera, renderer.domElement);

const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1, 0.4, 0.85 );
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;

const outputPass = new OutputPass();

const composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );
composer.addPass( outputPass );
// Clock
const clock = new THREE.Clock();

// Ray caster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const targetgeometry = new THREE.PlaneGeometry(2, 2);
const positionAttribute = targetgeometry.getAttribute( 'position' );
const vertex = new THREE.Vector3();
for ( let i = 0; i < positionAttribute.count; i ++ ) {

	vertex.fromBufferAttribute( positionAttribute, i ); // read vertex
	
	// do something with vertex

	positionAttribute.setXYZ( i, vertex.x, vertex.y, vertex.z ); // write coordinates back

}
const targetmesh = new THREE.Mesh(targetgeometry);


// Environment
const floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
//group.add(floorGeometry);

const objLoader = new OBJLoader();
let shark;
const sharkLoaded = new Promise((resolve) => {
  objLoader.load('assets/WhiteShark.obj', (sharkGeometry) => {
    sharkGeometry = sharkGeometry.children[0].geometry;
    sharkGeometry.computeVertexNormals();
    sharkGeometry.scale(0.12, 0.12, 0.12);
    sharkGeometry.rotateX(Math.PI / 2.);
    sharkGeometry.rotateZ(-Math.PI / 2.);
    sharkGeometry.translate(0, 0, 0.4);
    
    shark = sharkGeometry;
    //group.add(shark);
    resolve();
  });
});

let rock1;
let rock2;
const rockLoaded = new Promise((resolve) => {
  objLoader.load('assets/rock.obj', (rockGeometry) => {
    rockGeometry = rockGeometry.children[0].geometry;
    rockGeometry.computeVertexNormals();

    rock1 = new THREE.BufferGeometry().copy(rockGeometry);
    rock1.scale(0.05, 0.05, 0.02);
    rock1.translate(0.2, 0., 0.1);

    rock2 = new THREE.BufferGeometry().copy(rockGeometry);
    rock2.scale(0.05, 0.05, 0.05);
    rock2.translate(-0.5, 0.5, 0.2);
    rock2.rotateZ(Math.PI / 2.);
    //group.add(rock1);
    //group.add(rock2);
    resolve();
  });
});

let plant;
const plantLoaded = new Promise((resolve) => {
  objLoader.load('assets/plant.obj', (plantGeometry) => {
    plantGeometry = plantGeometry.children[0].geometry;
    plantGeometry.computeVertexNormals();

    plant = plantGeometry;
    plant.rotateX(Math.PI / 6.);
    plant.scale(0.03, 0.03, 0.03);
    plant.translate(-0.5, 0.5, 0.);
    //(plant);
    resolve();
  });
});


// const cubeGeometry = new THREE.BoxGeometry(50, 50);
// const cubeMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00});
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// scene.add(cube);
// group.add(plant);
// group.add(shark);
// group.add(floorGeometry);
// group.add(rock1);
// group.add(rock2);
//scene.add(group);

let envGeometries = [];

const gtlfLoader = new GLTFLoader();
const coralLoaded = new Promise((resolve, reject) => {
      gtlfLoader.load('./scenes/coral-reef.glb'
    ,function ( gltf ) {
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.set(0, 0, -5.8);
        gltf.scene.rotation.set(Math.PI / 2, Math.PI / 4, 0);
        scene.add(gltf.scene);

        const model = gltf.scene;
        model.traverse( function( child ) {
          if (child instanceof THREE.Mesh)
            envGeometries.push(child.geometry);
            child.receiveShadow = true;
        });
        model.receiveShadow = true;
        //coralreef = gltf.scene.geometries;
    },

    // called while loading is progressing
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        resolve();

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened ' + error.message);
        reject();

    });
  });

let animationClips = [];

let monsterMesh = new THREE.Mesh();
let clownfishMesh;
let bluetangMesh = new THREE.Mesh();
let brownfishMesh = new THREE.Mesh();
let tunaMesh = new THREE.Mesh();

const monsterLoaded = new Promise((resolve, reject) => {
    gtlfLoader.load('models/fish/monster.glb'
  ,function ( gltf ) {
    monsterMesh = gltf.scene;
    monsterMesh.position.set(0, 0, 0);
    monsterMesh.rotation.set(Math.PI / 2, 0, 0);
    monsterMesh.scale.set(5, 5, 5);
    monsterMesh.castShadow = true;
    monsterMesh.name = 'Monster';

    var monster = clone(monsterMesh);
    monster.position.set(0, 0, -5);
    monster.castShadow = true;
    //scene.add(monster);
    //scene.add(monsterMesh);
      //scene.add(model);
  },

  // called while loading is progressing
  function ( xhr ) {

      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      resolve();

  },
  // called when loading has errors
  function ( error ) {

      console.log( 'An error happened ' + error.message);
      reject();

  });
});

const clownFishLoaded = new Promise((resolve, reject) => {
  gtlfLoader.load('models/fish/clownfish.glb'
,function ( gltf ) {
    clownfishMesh = gltf.scene;
    animationClips = gltf.animations;
    
    clownfishMesh.position.set(0, 0, 2);
    clownfishMesh.rotation.set(Math.PI / 2, 0, 0);
    clownfishMesh.scale.set(.08, .08, .08);
    clownfishMesh.name = 'clownfish';
    clownfishMesh.traverse( function( child ) { 

      if ( child.isMesh ) {
  
          child.castShadow = true;
          child.receiveShadow = true;
  
      }
  
  } );
    
    createClownFish(7);
    
},

// called while loading is progressing
function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    resolve();

},
// called when loading has errors
function ( error ) {

    console.log( 'An error happened ' + error.message);
    reject();

});
});

const blueTangFishLoaded = new Promise((resolve, reject) => {
  gtlfLoader.load('models/fish/bluetang.glb'
,function ( gltf ) {
    bluetangMesh = gltf.scene;
    bluetangMesh.position.set(0, 0, 2);
    bluetangMesh.rotation.set(Math.PI / 2, 0, 0);
    bluetangMesh.scale.set(.05, .05, .05);
    bluetangMesh.name = 'bluetang';
    bluetangMesh.traverse( function( child ) { 

      if ( child.isMesh ) {
  
          child.castShadow = true;
          child.receiveShadow = true;
  
      }
  
  } );
    createBlueTangFish(7, new THREE.Vector3(0, 0, 0), 1);
},

// called while loading is progressing
function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    resolve();

},
// called when loading has errors
function ( error ) {

    console.log( 'An error happened ' + error.message);
    reject();

},

// called while loading is progressing
function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    resolve();

},
// called when loading has errors
function ( error ) {

    console.log( 'An error happened ' + error.message);
    reject();

});
});

const tunaFishLoaded = new Promise((resolve, reject) => {
  gtlfLoader.load('models/fish/tuna.glb'
,function ( gltf ) {
    tunaMesh = gltf.scene;
    tunaMesh.position.set(0, 0, 2);
    tunaMesh.rotation.set(Math.PI / 2, 0, 0);
    tunaMesh.scale.set(.2, .2, .2);
    tunaMesh.name = 'tuna';
    tunaMesh.traverse( function( child ) { 

      if ( child.isMesh ) {
  
          child.castShadow = true;
          child.receiveShadow = true;
  
      }
  
  } );
    createTunaFish(3, 5);
},

// called while loading is progressing
function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    resolve();

},
// called when loading has errors
function ( error ) {

    console.log( 'An error happened ' + error.message);
    reject();

});
});

const brownFishLoaded = new Promise((resolve, reject) => {
  gtlfLoader.load('models/fish/brownfish.glb'
,function ( gltf ) {
    const model = gltf.scene;
    model.traverse( function( child ) {
      if (child instanceof THREE.Mesh) {
        gltf.scene.position.set(0, 0, 2);
        model.rotation.set(Math.PI / 2, 0, 0);
        model.scale.set(.1, .1, .1);
        model.name = 'brownfish';
        brownfishMesh = model;
      }
    });
    //brownfishMesh = model;
},

// called while loading is progressing
function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    resolve();

},
// called when loading has errors
function ( error ) {

    console.log( 'An error happened ' + error.message);
    reject();

});
});




// Skybox
const cubetextureloader = new THREE.CubeTextureLoader();

const skybox = cubetextureloader.load([
  'assets/TropicalSunnyDay_px.jpg', 'assets/TropicalSunnyDay_nx.jpg',
  'assets/TropicalSunnyDay_py.jpg', 'assets/TropicalSunnyDay_ny.jpg',
  'assets/TropicalSunnyDay_pz.jpg', 'assets/TropicalSunnyDay_nz.jpg',
]);

//scene.background = skybox;

const textureLoader = new THREE.TextureLoader();
const sand_texture = textureLoader.load('textures/sand_texture_2.jpg' ); 

const white_texture = textureLoader.load('textures/caustics_texture.png' );
const caustics_texture = textureLoader.load('textures/CausticsRender_003.png' );

spotLight.map = sand_texture;
spotLight.castShadow = true;
// immediately use the texture for material creation 

const material = new THREE.MeshStandardMaterial( { map: sand_texture } );
//material.skinning = true;
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMesh = new THREE.Mesh(planeGeometry, material);
planeMesh.position.set(0, 0, 0);
planeMesh.receiveShadow = true;
//causticsScene.add(planeMesh);
scene.add(planeMesh);

const materialCaustics = new THREE.MeshStandardMaterial( {  map: caustics_texture});
const causticsMesh = new THREE.Mesh(planeGeometry, materialCaustics);
causticsMesh.position.set(5, 0, 5);
causticsScene.add(causticsMesh);

const causticsMesh2 = new THREE.Mesh(planeGeometry, materialCaustics);
causticsMesh2.position.set(-5, 0, 5);
causticsScene.add(causticsMesh2);


//causticsMesh.castShadow = true
var count = 1;

const rotationMatrix = new THREE.Matrix4();
const targetQuaternion = new THREE.Quaternion();

const fishGroup = [];
// Main rendering loop
function animate() {
  stats.begin();

  renderer.setRenderTarget(temporaryRenderTarget);
  
  renderer.clear();
  renderer.setClearColor(0x194df7);
  renderer.render(causticsScene, causticsCamera);

  renderer.setRenderTarget(null);
  renderer.clear();
  renderer.setClearColor(0x194df7);
  //renderer.render(causticsScene, causticsCamera);
  renderer.render(scene, camera);
  const delta = clock.getDelta();
  fishGroup.forEach(fish => {

    if (fish.name == 'Monster') {
      // fish.fishMesh.position.x = Math.sin(clock.getElapsedTime() * 2 * Math.PI * fish.speed) * fish.radius;
      // fish.fishMesh.position.y = Math.cos(clock.getElapsedTime() * 2 * Math.PI * fish.speed) * fish.radius;
    }
    else {
      if (fish.fishMesh.position.distanceTo(fish.destPos) < 0.1) {
        fish.setDestPos();
      }
      var dir = new THREE.Vector3(); 
      const step = delta;
      dir.subVectors( fish.destPos, fish.fishMesh.position ).normalize();
      fish.fishMesh.position.x += dir.x * step * fish.speed;
      fish.fishMesh.position.y += dir.y * step * fish.speed;
      fish.fishMesh.position.z += dir.z * step * fish.speed;
      rotationMatrix.lookAt( fish.fishMesh.position, fish.destPos, new THREE.Vector3(0, 0, 1) );
      targetQuaternion.setFromRotationMatrix( rotationMatrix );
      fish.fishMesh.quaternion.rotateTowards( targetQuaternion, 5 * delta );
    }

    fish.mixer.update(delta);
    //fish.fishMesh.lookAt(new THREE.Vector3(-fish.destPos.x, fish.destPos.y, fish.destPos.z));
  });
  //composer.render();
  //renderer.render(scene, camera)

  controls.update();
  TWEEN.update();
  stats.end();

  requestAnimationFrame(animate);
}


const loaded = [
  // waterSimulation.loaded,
  // water.loaded,
  // environmentMap.loaded,
  // environment.loaded,
  // caustics.loaded,
  // debug.loaded,
  // sharkLoaded,
  // rockLoaded,
  // plantLoaded,
  clownFishLoaded,
  monsterLoaded,
  blueTangFishLoaded,
  brownFishLoaded,
  tunaFishLoaded,
  coralLoaded
];

// function testAlphaBlend(texture, textureAlpha) {
//   const size = textureAlpha.image.width * textureAlpha.image.height;
//   const textureData = texture.image.data;
//   const data = textureAlpha.image.data;

//   // generate a random color and update texture data

//   // color.setHex( Math.random() * 0xffffff );

//   // const r = Math.floor( color.r * 255 );
//   // const g = Math.floor( color.g * 255 );
//   // const b = Math.floor( color.b * 255 );

//   for ( let i = 0; i < size; i ++ ) {
//       if (data[i].alpha > 0) {
//         data[i] = data[i] * textureData[i];
//       }
//   }
// }

await Promise.all(loaded).then(() => {
  //createClownFish(5);
  console.log("Done");
  animate();
});

function createClownFish(numberOfFish) {
  for (var i = 0; i < numberOfFish; i++) {
    var clownFish = clone(clownfishMesh);
    clownFish.position.set(getRandomInt(-4, 5), getRandomInt(-4, 5), getRandomInt(1, 4));
    clownFish.castShadow = true;
    scene.add(clownFish);
    var fish = new Fish(clownFish, 'Clownfish', .25);
    fish.setDestPos();
    fishGroup.push(fish);
    const mixer = new THREE.AnimationMixer( clownFish );
    fish.setMixer(mixer);


    const clip = THREE.AnimationClip.findByName( animationClips, 'ClownFish' );
    const action = mixer.clipAction( clip );
    action.play();
  }
}

function createBlueTangFish(numberOfFish, centerPos, radius) {
  for (var i = 0; i < numberOfFish; i++) {
    var bluetang = clone(bluetangMesh);
    bluetang.position.set(centerPos.x + getRandomInt(-radius, radius + 1), 
      centerPos.y + getRandomInt(-radius, radius + 1), 
      centerPos.z + getRandomInt(-radius, radius + 1));
    bluetang.castShadow = true;
    scene.add(bluetang);
    var fish = new Fish(bluetang, 'Bluetang', .8, centerPos, radius);
    fish.setDestPos();
    fishGroup.push(fish);
    const mixer = new THREE.AnimationMixer( bluetang );
    fish.setMixer(mixer);


    const clip = THREE.AnimationClip.findByName( animationClips, 'DorySwim' );
    const action = mixer.clipAction( clip );
    action.play();
  }
}

function createTunaFish(numberOfFish, radius) {
  for (var i = 0; i < numberOfFish; i++) {
    var tuna = clone(tunaMesh);
    tuna.position.set(getRandomInt(-radius, radius + 1), 
          getRandomInt(-radius, radius + 1), 
          getRandomInt(7, 10));
    tuna.castShadow = true;
    scene.add(tuna);
    var fish = new Fish();
    fish.name = 'Tuna';
    fish.fishMesh = tuna;
    fish.speed = .2;
    fish.radius = radius;
    fish.setDestPos();
    fishGroup.push(fish);
    const mixer = new THREE.AnimationMixer( tuna );
    fish.setMixer(mixer);

    const clip = THREE.AnimationClip.findByName( animationClips, 'TunaSwim' );
    const action = mixer.clipAction( clip );
    action.play();
  }
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

class Fish {
  constructor(fishMesh, name, speed, centerPos, radius) {
    this.fishMesh = fishMesh;
    this.speed = speed;
    this.centerPos = centerPos;
    this.radius = radius;
    this.name = name;
  }

  setDestPos() {
    var destPos;
    switch (this.name) {
      case 'Clownfish':
        destPos = new THREE.Vector3(getRandomInt(-4, 5), getRandomInt(-4, 5), getRandomInt(0, 4));
        this.destPos = destPos;
        break;
      case 'Bluetang':
        destPos = new THREE.Vector3(this.centerPos.x + getRandomInt(-this.radius, this.radius + 1), 
          this.centerPos.y + getRandomInt(-this.radius, this.radius + 1), 
          this.centerPos.z + getRandomInt(this.centerPos.z, this.radius + 1));
        this.destPos = destPos;
        break;
      case 'Tuna':
        var multiplier = this.fishMesh.position > 0 ? -1 : 1;
        destPos = new THREE.Vector3(multiplier * getRandomInt(3, 6), multiplier * getRandomInt(3, 6), this.fishMesh.position.z);
        this.destPos = destPos;
        break;
    }
  }

  setMixer(mixer) {
    this.mixer = mixer;
  }
}