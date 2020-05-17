import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
const OrbitControls = require('three-orbit-controls')(THREE);

// Import utility functions from utility.js

// 3D modules import
import islandObjPath from './modules/island.obj';
import islandMtlPath from './modules/island.mtl';

// Reset default CSS
const stylesheet = document.createElement('style');
stylesheet.type = 'text/css';
stylesheet.innerText = `body{margin: 0;overflow:hidden}canvas{width: 100%;height: 100%;}`;
document.head.appendChild(stylesheet);

// Scene Rendering, Camera and Orbit Control
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const ratio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
camera.position.set(0, 10, 30);
// eslint-disable-next-line no-unused-vars
const control = new OrbitControls(camera);

// Basic Lighting
const cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.8);
cameralight.castShadow = true;
camera.add(cameralight);
scene.add(camera);

// Ambient Lighting
const ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.3);
scene.add(ambientLight);

// Declare scene control variables here (ie: number of trees, color of leaves)
let numberOfTrees = 1;
let colorOfLeaves = '#2dc89b';
let islandRotationSpeed = 0.5;

// Scene GUI. Should use variables from above
const gui = new dat.GUI();
const params = {
    numberOfTrees: numberOfTrees,
    colorOfLeaves: colorOfLeaves,
    plainRotationSpeed: islandRotationSpeed,
};

// Prefer onFinishChange() to reduce re-render calls. If change is immediate use onChange()
gui.add(params, 'plainRotationSpeed', 0.5, 5).onFinishChange(val => {
    islandRotationSpeed = val;
});
gui.add(params, 'numberOfTrees', 1, 10).onFinishChange(val => {
    // Set # of trees
    console.log(val);
});
gui.addColor(params, 'colorOfLeaves').onChange(val => {
    // Set color of leaves
    console.log(val);
});
gui.open();

// Declare & Add Objects to Scene here. You can also attach objects to each other and only add the parent object to the scene
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();

let islandObject = new THREE.Group();

mtlLoader.load(islandMtlPath, materials => {
    materials.preload();

    objLoader.setMaterials(materials).load(islandObjPath, object => {
        islandObject = object;
        scene.add(islandObject);
    });
});

// Scene Animation (called 60 times/sec). This should call other functions that updates objects
function animate() {
    requestAnimationFrame(animate);
    islandObject.rotateY(islandRotationSpeed / 100);
    renderer.render(scene, camera);
}
animate();
