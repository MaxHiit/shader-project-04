import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import GUI from 'lil-gui';
import gsap from 'gsap';

import fireworkVertexShader from './shaders/firework/vertex.glsl';
import fireworkFragmentShader from './shaders/firework/fragment.glsl';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
	pixelRatio: Math.min(window.devicePixelRatio, 2)
};
sizes.resolution = new THREE.Vector2(
	sizes.width * sizes.pixelRatio,
	sizes.height * sizes.pixelRatio
);

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
	sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 6);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Fireworks
 */

// Texture
const textureLoader = new THREE.TextureLoader();

const textures = [
	textureLoader.load('/textures/particles/01.png'),
	textureLoader.load('/textures/particles/02.png'),
	textureLoader.load('/textures/particles/03.png'),
	textureLoader.load('/textures/particles/04.png')
];

const createFirework = (fireworkParams) => {
	const { count, position, size, texture, radius, color } = fireworkParams;

	// Geometry
	const positionsArray = new Float32Array(count * 3);
	const positionsSphereArray = new Float32Array(count * 3);
	const sizesArray = new Float32Array(count);
	const timeMultipliersArray = new Float32Array(count);

	for (let i = 0; i < count; i++) {
		const i3 = i * 3;

		const spherical = new THREE.Spherical(
			radius * (0.75 + Math.random() * 0.25),
			Math.random() * Math.PI,
			Math.random() * Math.PI * 2
		);

		const sphericalPosition = new THREE.Vector3();
		sphericalPosition.setFromSpherical(spherical);

		positionsSphereArray[i3] = sphericalPosition.x;
		positionsSphereArray[i3 + 1] = sphericalPosition.y;
		positionsSphereArray[i3 + 2] = sphericalPosition.z;

		positionsArray[i3] = position.x;
		positionsArray[i3 + 1] = position.y;
		positionsArray[i3 + 2] = position.z;

		sizesArray[i] = Math.random();

		timeMultipliersArray[i] = 1 + Math.random();
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3));
	geometry.setAttribute(
		'aSpherePosition',
		new THREE.Float32BufferAttribute(positionsSphereArray, 3)
	);

	geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(positionsArray, 1));
	geometry.setAttribute(
		'aTimeMultiplier',
		new THREE.Float32BufferAttribute(timeMultipliersArray, 1)
	);

	// Material
	texture.flipY = false;

	const material = new THREE.ShaderMaterial({
		vertexShader: fireworkVertexShader,
		fragmentShader: fireworkFragmentShader,
		uniforms: {
			uSize: new THREE.Uniform(size),
			uResolution: new THREE.Uniform(sizes.resolution),
			uTexture: new THREE.Uniform(texture),
			uColor: new THREE.Uniform(color),
			uProgress: new THREE.Uniform(0)
		},
		transparent: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});

	// Points
	const firework = new THREE.Points(geometry, material);
	firework.position.copy(position);
	scene.add(firework);

	// Sound
	// const listener = new THREE.AudioListener();
	// camera.add(listener);
	// const sound = new THREE.Audio(listener);
	// const audioLoader = new THREE.AudioLoader();
	// audioLoader.load('/sounds/firework.mp3', function (buffer) {
	// 	sound.setBuffer(buffer);
	// 	sound.setVolume(0.5);
	// 	sound.play();
	// });

	// Destroy
	const destroy = () => {
		scene.remove(firework);
		geometry.dispose();
		material.dispose();

		console.log('destroy');
	};

	// Animate
	gsap.to(material.uniforms.uProgress, {
		value: 1,
		duration: 3,
		ease: 'linear',
		onComplete: () => {
			// sound.stop();
			destroy();
		}
	});
};

const createRandomFirework = () => {
	const count = Math.round(400 + Math.random() * 1000);
	const position = new THREE.Vector3((Math.random() - 0.5) * 2, -0.5, (Math.random() - 0.5) * 2);
	const size = 0.1 + Math.random() * 0.1;
	const texture = textures[Math.floor(Math.random() * textures.length)];
	const radius = 0.5 + Math.random();
	const color = new THREE.Color();
	color.setHSL(Math.random(), 1, 0.7);

	const fireworkParams = {
		count,
		position,
		size,
		texture,
		radius,
		color
	};

	createFirework(fireworkParams);
};

createRandomFirework();

window.addEventListener('click', createRandomFirework);

/**
 * Animate
 */
const tick = () => {
	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
