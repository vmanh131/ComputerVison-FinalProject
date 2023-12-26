import * as YUKA from 'yuka';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
		let renderer, scene, camera;

		let entityManager, time, clock;

		let mixer;

		const params = {
			alignment: 1,
			cohesion: 0.9,
			separation: 1
		};

		init();
		animate();

		function init() {

			scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 500 );
			camera.position.set( 0, 75, 0 );
			
			const ambientLight = new THREE.AmbientLight(0xfffffff, 2);
			scene.add(ambientLight);
			// game setup

			entityManager = new YUKA.EntityManager();
			time = new YUKA.Time();
			clock = new THREE.Clock();

			const alignmentBehavior = new YUKA.AlignmentBehavior();
			const cohesionBehavior = new YUKA.CohesionBehavior();
			const separationBehavior = new YUKA.SeparationBehavior();

			alignmentBehavior.weight = params.alignment;
			cohesionBehavior.weight = params.cohesion;
			separationBehavior.weight = params.separation;
			
		const loader = new GLTFLoader();
		// let mixer;
		loader.load('./3DModel/clown_fish/scene.gltf', function(gltf) {
			const object = gltf.scene;
        	const clips = gltf.animations;
        	const fishes = new THREE.AnimationObjectGroup();
        	mixer = new THREE.AnimationMixer(fishes);
        	const clip = clips.find(clip => clip.name === 'Fish_001_animate_preview');
        	//const clip = new THREE.AnimationClip.findByName(clips, 'Action');
        	var action = mixer.clipAction(clip);
        	action.play();

			for ( let i = 0; i < 10; i ++ ) {

				//const vehicleMesh = new THREE.Mesh( vehicleGeometry, vehicleMaterial );
				const fishClone = SkeletonUtils.clone(object);
				fishClone.matrixAutoUpdate = false;
				scene.add( fishClone );
				fishes.add(fishClone);

				const vehicle = new YUKA.Vehicle();
				vehicle.scale = new YUKA.Vector3(0.05, 0.05, 0.05);
				vehicle.maxSpeed = 1.5;
				vehicle.updateNeighborhood = true;
				vehicle.neighborhoodRadius = 10;
				vehicle.rotation.fromEuler( 0, Math.PI * Math.random(), 0 );
				vehicle.position.x = 10 - Math.random() * 20;
				vehicle.position.y = 10 - Math.random() * 20;
				vehicle.position.z = 10 - Math.random() * 20;
				vehicle.setRenderComponent( fishClone, sync );

				vehicle.steering.add( alignmentBehavior );
				vehicle.steering.add( cohesionBehavior );
				vehicle.steering.add( separationBehavior );

				const wanderBehavior = new YUKA.WanderBehavior();
				wanderBehavior.weight = 0.5;
				vehicle.steering.add( wanderBehavior );

				entityManager.add( vehicle );

			}
		});

			//

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );

			//
            let controls;
            controls = new OrbitControls(camera, renderer.domElement);

			//

			window.addEventListener( 'resize', onWindowResize, false );

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		function animate() {

			requestAnimationFrame( animate );

			const clockDelta = clock.getDelta();

			if (mixer)
				mixer.update(clockDelta)

			const delta = time.update().getDelta();

			entityManager.update( delta );

			renderer.render( scene, camera );

		}

		function sync( entity, renderComponent ) {

			renderComponent.matrix.copy( entity.worldMatrix );

		}
