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
import { buildRadiantSphere } from './lightSourceHelper';

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
scene.add(camera);
const orbitControl = new OrbitControls(camera);
orbitControl.maxDistance = 1000;
orbitControl.maxPolarAngle = Math.PI / 2;

// Lighting Models
const sunLight = new THREE.DirectionalLight(0xf0be62, 0.9);
sunLight.castShadow = true;
const sunLightSphere = buildRadiantSphere(50, 0xf0be62, true);
sunLight.attach(sunLightSphere);

const moonLight = new THREE.HemisphereLight(0x6f8686, 0.05);
const moonLightShpere = buildRadiantSphere(20, 0x6f8686, false);
moonLight.attach(moonLightShpere);
scene.add(moonLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// FPS Counter
const fpsCounter = new Stats();
fpsCounter.showPanel(0);
document.body.appendChild(fpsCounter.dom);

// Declare scene control variables here (ie: number of trees, color of leaves)
let isDay = false;
let treeArray = [];
let weatherMode = 'sunny';
let lightingAngle = 0;
let lightCycleTracker = 0;

// Scene Background
const skyboxDay = createSkyboxDay();
const skyboxNight = createSkyboxNight();
if (isDay) {
    scene.add(skyboxDay);
} else {
    scene.add(skyboxNight);
}

// Ocean Control
let ocean = new Ocean(0x68c3c0, 0, 0.7);
scene.add(ocean.mesh);

// Declare & Add Objects to Scene here. You can also attach objects to each other and only add the parent object to the scene
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();

let islandObject = new THREE.Group();

mtlLoader.load(islandMtlPath, materials => {
    materials.preload();
    objLoader.setMaterials(materials).load(islandObjPath, object => {
        islandObject = object;
        islandObject.receiveShadow = true;
        islandObject.castShadow = true;
        islandObject.scale.x = islandObject.scale.y = islandObject.scale.z = 10;
        scene.add(islandObject);
    });
});

// Weather Control
let rain = new Rain(15000);
let snow = new Snow(20000);

// Scene GUI. Should use letiables from above
const gui = new dat.GUI();
const guiParams = {
    islandRotationSpeed: 0.3,
    oceanHeight: 0,
    waveSpeed: 0.02,
    waterColor: 0x68c3c0,
    waterOpacity: 0.7,
    waveIntensity: 1.8,
    toggleDayNight: () => {
        if (isDay) {
            lightingAngle = 1;
            scene.add(skyboxNight);
            scene.add(moonLight);
            scene.remove(skyboxDay);
            scene.remove(sunLight);
        } else {
            lightingAngle = 0.5;
            scene.add(skyboxDay);
            scene.add(sunLight);
            scene.remove(skyboxNight);
            scene.remove(moonLight);
        }
        lightCycleTracker = 0;
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
    time: 0.0005,
    sunLightColor: sunLight.color.getHex(),
    moonLightColor: moonLight.color.getHex(),
};

// Lighting Control
function animateLighting() {
    lightingAngle += guiParams.time;
    lightCycleTracker += guiParams.time;

    if (lightingAngle >= 1) {
        lightingAngle = 0;
    }
    if (lightCycleTracker >= 0.5) {
        guiParams.toggleDayNight();
        lightCycleTracker = 0;
    }

    var phi = 2 * Math.PI * (lightingAngle - 0.5);
    sunLight.position.x = 500 * Math.cos(phi);
    sunLight.position.y = 500 * Math.sin(phi) * Math.sin(0.5);
    sunLight.position.z = 500 * Math.sin(phi) * Math.sin(0.5);

    moonLight.position.x = -sunLight.position.x;
    moonLight.position.y = -sunLight.position.y;
    moonLight.position.z = -sunLight.position.z;
}

// Prefer onFinishChange() to reduce re-render calls. If change is immediate use onChange()
gui.add(guiParams, 'islandRotationSpeed', 0, 2);
gui.open();

const treeControlUI = gui.addFolder('Tree Controls');
treeControlUI.add(guiParams, 'AddTree');
treeControlUI.add(guiParams, 'RemoveTree');
treeControlUI.add(guiParams, 'RemoveAllTrees');
treeControlUI.open();

const environmentControlUI = gui.addFolder('Environment Controls');
environmentControlUI.add(guiParams, 'toggleDayNight');
environmentControlUI.add(guiParams, 'cycleWeather');
environmentControlUI.add(guiParams, 'time', 0.00005, 0.002);
environmentControlUI
    .addColor(guiParams, 'sunLightColor')
    .onFinishChange(val => {
        sunLight.color = new THREE.Color(val);
        sunLightSphere.material.setValues({ color: val });
    });
environmentControlUI
    .addColor(guiParams, 'moonLightColor')
    .onFinishChange(val => {
        moonLight.color = new THREE.Color(val);
        moonLightShpere.material.setValues({ color: val });
    });
environmentControlUI.open();

const oceanControlUI = gui.addFolder('Ocean Controls');
oceanControlUI
    .add(guiParams, 'oceanHeight', -1, 10, 0.1)
    .onFinishChange(val => (ocean.mesh.position.y = val));
oceanControlUI.add(guiParams, 'waveSpeed', 0.01, 0.2);
oceanControlUI.add(guiParams, 'waveIntensity', 0.1, 4.5);
oceanControlUI
    .add(guiParams, 'waterOpacity', 0.2, 1)
    .onFinishChange(() =>
        ocean.mesh.material.setValues({ opacity: guiParams.waterOpacity })
    );
oceanControlUI
    .addColor(guiParams, 'waterColor')
    .onFinishChange(() =>
        ocean.mesh.material.setValues({ color: guiParams.waterColor })
    );
oceanControlUI.open();

// Scene Animation (called 60 times/sec). This should call other functions that updates objects
function animate() {
    fpsCounter.begin();
    islandObject.rotateY(guiParams.islandRotationSpeed / 100);
    ocean.animateWaves(guiParams.waveSpeed, guiParams.waveIntensity);
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
