import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

export function editUpdate(scene, camera) {
    raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
    if (intersects.length == 0) {
		scene.children.forEach(child => {
            child.material.color.set(0x00ff00);
        });
    }
	for ( let i = 0; i < intersects.length; i ++ ) {
        console.log('found sth');
		intersects[ i ].object.material.color.set( 0xff0000 );
	}
};

window.addEventListener( 'pointermove', onPointerMove );