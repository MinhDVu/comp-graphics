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
import { removeAllTrees } from './treeHelper';
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
// orbitControl.maxDistance = 1000;
// orbitControl.maxPolarAngle = Math.PI / 2;

// Basic Lighting
let directionalLight = new THREE.DirectionalLight(0xf0be62, 0.8);
// directionalLight.position.set(200, 200, 0);
scene.add(directionalLight);
directionalLight.castShadow = true;
scene.add(camera);

const pointLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    10,
    0x00ff00
);
scene.add(pointLightHelper);

// Ambient Lighting
const hemisLight = new THREE.HemisphereLight(0xb8e3e3, 0.1);
// hemisLight.position.set(0, 200, 200);
scene.add(hemisLight);
const hemisLightHelper = new THREE.HemisphereLightHelper(
    hemisLight,
    10,
    0x00ff00
);
scene.add(hemisLightHelper);

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
let waterOpacity = 0.7;
let waveIntensity = 0.8;
let treeArray = [];
let weatherMode = 'sunny';
let azimuth = 0;

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
        addTree(islandObject, treeArray);
    },
    RemoveTree: () => {
        if (treeArray.length > 0) {
            removeTree(islandObject, treeArray);
        }
    },
    RemoveAllTrees: () => {
        removeAllTrees(islandObject, treeArray);
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

// Lighting Control
function animateLighting() {
    azimuth += 0.01 / 10;
    pointLightHelper.update();
    hemisLightHelper.update();
    if (azimuth >= 1) {
        azimuth = 0;
    }

    var phi = 2 * Math.PI * (azimuth - 0.5);
    directionalLight.position.x = 400 * Math.cos(phi);
    directionalLight.position.y = 400 * Math.sin(phi) * Math.sin(0.5);
    directionalLight.position.z = 400 * Math.sin(phi) * Math.sin(0.5);

    hemisLight.position.x = -directionalLight.position.x;
    hemisLight.position.y = -directionalLight.position.y;
    hemisLight.position.z = -directionalLight.position.z;
}

// Prefer onFinishChange() to reduce re-render calls. If change is immediate use onChange()
gui.add(guiParams, 'islandRotationSpeed', 0, 5).onFinishChange(val => {
    islandRotationSpeed = val;
});
gui.open();

const treeControlUI = gui.addFolder('Tree Controls');
treeControlUI.add(guiParams, 'AddTree');
treeControlUI.add(guiParams, 'RemoveTree');
treeControlUI.add(guiParams, 'RemoveAllTrees');
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
    // islandObject.rotateY(islandRotationSpeed / 100);
    ocean.animateWaves(waveSpeed, waveIntensity);
    if (weatherMode === 'rainy') {
        rain.animateRainDrop();
    } else if (weatherMode === 'snowy') {
        snow.animateSnowFlakes();
    }
    animateLighting();
    renderer.render(scene, camera);
    fpsCounter.end();
    requestAnimationFrame(animate);
}

animate();
