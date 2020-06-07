import * as THREE from 'three';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
const OrbitControls = require('three-orbit-controls')(THREE);

// Import utility functions
import { createSkyboxNight, createSkyboxDay } from './skyboxHelper';
import Ocean from './ocean';
import { addTree } from './treeHelper';
import { removeTree } from './treeHelper';
import Rain from './rain';
import Snow from './winter';

// 3D modules import
import islandObjPath from './models/island.obj';
import islandMtlPath from './models/island.mtl';

// Reset default CSS
const stylesheet = document.createElement('style');
stylesheet.type = 'text/css';
stylesheet.innerText = `body{margin: 0;overflow:hidden}canvas{width: 100%;height: 100%;}`;
document.head.appendChild(stylesheet);

// Scene Rendering, Camera and Orbit Control
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const ratio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 15000);
camera.position.set(500, 200, 30);
const orbitControl = new OrbitControls(camera);
orbitControl.maxDistance = 1000;
orbitControl.maxPolarAngle = Math.PI / 2;

// Basic Lighting
const cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.8);
cameralight.castShadow = true;
camera.add(cameralight);
scene.add(camera);

// Ambient Lighting
const ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.55);
scene.add(ambientLight);

// FPS Counter
const fpsCounter = new Stats();
fpsCounter.showPanel(0);
document.body.appendChild(fpsCounter.dom);

// Declare scene control variables here (ie: number of trees, color of leaves)
let islandRotationSpeed = 1;
let isDay = true;
let oceanHeight = 0;
let waveSpeed = 0.08;
let waterColor = 0x68c3c0;
let waterOpacity = 0.5;
let waveIntensity = 0.25;
let treeArray = [];
let weatherMode = 'sunny';

// Scene Background
const skyboxDay = createSkyboxDay();
const skyboxNight = createSkyboxNight();
if (isDay) {
    scene.add(skyboxDay);
} else {
    scene.add(skyboxNight);
}

// Ocean Control
let ocean = new Ocean(waterColor, oceanHeight, waterOpacity);
scene.add(ocean.mesh);

// Declare & Add Objects to Scene here. You can also attach objects to each other and only add the parent object to the scene
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();

let islandObject = new THREE.Group();

mtlLoader.load(islandMtlPath, materials => {
    materials.preload();
    objLoader.setMaterials(materials).load(islandObjPath, object => {
        islandObject = object;
        islandObject.scale.x = islandObject.scale.y = islandObject.scale.z = 10;
        scene.add(islandObject);
    });
});
// Weather Control
let rain = new Rain(5000);
let snow = new Snow(5000);

// Scene GUI. Should use letiables from above
const gui = new dat.GUI();
const guiParams = {
    islandRotationSpeed: islandRotationSpeed,
    oceanHeight: oceanHeight,
    waveSpeed: waveSpeed,
    waterColor: waterColor,
    waterOpacity: waterOpacity,
    waveIntensity: waveIntensity,
    toggleDayNight: () => {
        if (isDay) {
            scene.add(skyboxNight);
            scene.remove(skyboxDay);
        } else {
            scene.add(skyboxDay);
            scene.remove(skyboxNight);
        }
        isDay = !isDay;
    },
    AddTree: () => {
        addTree(islandObject, treeArray, objLoader, mtlLoader);
    },
    RemoveTree: () => {
        if (treeArray.length > 0) {
            removeTree(islandObject, treeArray);
        }
    },
    cycleWeather: () => {
        if (weatherMode === 'sunny') {
            scene.add(rain.rainSystem);
            weatherMode = 'rainy';
        } else if (weatherMode === 'rainy') {
            scene.remove(rain.rainSystem);
            scene.add(snow.snowSystem);
            weatherMode = 'snowy';
        } else if (weatherMode === 'snowy') {
            scene.remove(snow.snowSystem);
            weatherMode = 'sunny';
        }
    },
};

// Prefer onFinishChange() to reduce re-render calls. If change is immediate use onChange()
gui.add(guiParams, 'islandRotationSpeed', 0.5, 5).onFinishChange(val => {
    islandRotationSpeed = val;
});
gui.open();

const treeControlUI = gui.addFolder('Tree Controls');
treeControlUI.add(guiParams, 'AddTree');
treeControlUI.add(guiParams, 'RemoveTree');
treeControlUI.open();

const environmentControlUI = gui.addFolder('Environment Controls');
environmentControlUI.add(guiParams, 'toggleDayNight');
environmentControlUI.add(guiParams, 'cycleWeather');
environmentControlUI.open();

const oceanControlUI = gui.addFolder('Ocean Controls');
oceanControlUI.add(guiParams, 'oceanHeight', -1, 1, 0.1).onFinishChange(val => {
    oceanHeight = val;
    ocean.mesh.position.y = oceanHeight;
});
oceanControlUI
    .add(guiParams, 'waveSpeed', 0.01, 0.2)
    .onFinishChange(val => (waveSpeed = val));
oceanControlUI
    .add(guiParams, 'waveIntensity', 0.1, 4.5)
    .onFinishChange(val => (waveIntensity = val));
oceanControlUI.add(guiParams, 'waterOpacity', 0.2, 1).onFinishChange(val => {
    waterOpacity = val;
    ocean.mesh.material.setValues({ opacity: waterOpacity });
});
oceanControlUI.addColor(guiParams, 'waterColor').onFinishChange(val => {
    waterColor = val;
    ocean.mesh.material.setValues({ color: waterColor });
});
oceanControlUI.open();

// Scene Animation (called 60 times/sec). This should call other functions that updates objects
function animate() {
    fpsCounter.begin();
    islandObject.rotateY(islandRotationSpeed / 100);
    ocean.animateWaves(waveSpeed, waveIntensity);
    if (weatherMode === 'rainy') {
        rain.animateRainDrop();
    } else if (weatherMode === 'snowy') {
        snow.animateSnowFlakes();
    }
    renderer.render(scene, camera);
    fpsCounter.end();
    requestAnimationFrame(animate);
}

animate();
