import * as THREE from 'three';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
const OrbitControls = require('three-orbit-controls')(THREE);

// Import utility functions from utility.js
import { createSkyboxNight, createSkyboxDay } from './skyboxHelper';
import Ocean from './ocean';

// 3D modules import
import islandObjPath from './models/island.obj';
import islandMtlPath from './models/island.mtl';

//import snow texture
import snowPath from './models/snow.png';

//import rain texture
import rainPath from './models/rain.png';

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
const camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
camera.position.set(0, 10, 30);
const orbitControl = new OrbitControls(camera);
orbitControl.maxDistance = 120;
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

// Declare scene control letiables here (ie: number of trees, color of leaves)
let numberOfTrees = 1;
let colorOfLeaves = '#2dc89b';
let islandRotationSpeed = 1;
let isDay = true;
let oceanHeight = 0;
let waveSpeed = 0.08;
let waterColor = 0x68c3c0;
let waterOpacity = 0.5;
let waveIntensity = 0.25;

// Snow Effect Variables
let snow, snowGeo, snowSystem;

// Rain Effect Variables
let rainSystem, rainGeo, rainCount = 30000;
let rainDrop;

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

// Scene GUI. Should use letiables from above
const gui = new dat.GUI();
const guiParams = {
    numberOfTrees: numberOfTrees,
    colorOfLeaves: colorOfLeaves,
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
};

// Prefer onFinishChange() to reduce re-render calls. If change is immediate use onChange()
gui.add(guiParams, 'islandRotationSpeed', 0.5, 5).onFinishChange(val => {
    islandRotationSpeed = val;
});
gui.add(guiParams, 'numberOfTrees', 0, 100, 1).onFinishChange(val => {
    // Set # of trees
    console.log(val);
});
gui.addColor(guiParams, 'colorOfLeaves').onChange(val => {
    // Set color of leaves
    console.log(val);
});
gui.open();

const environmentControlUI = gui.addFolder('Environment Controls');
environmentControlUI.add(guiParams, 'toggleDayNight');
environmentControlUI.open();

const oceanControlUI = gui.addFolder('Ocean Controls');
oceanControlUI.add(guiParams, 'oceanHeight', -1, 1, 0.1).onFinishChange(val => {
    oceanHeight = val;
    ocean.mesh.position.y = oceanHeight;
});
oceanControlUI.add(guiParams, 'waveSpeed', 0.01, 0.3).onFinishChange(val => {
    waveSpeed = val;
});
oceanControlUI.add(guiParams, 'waveIntensity', 0.1, 0.6).onFinishChange(val => {
    waveIntensity = val;
});
oceanControlUI.add(guiParams, 'waterOpacity', 0.2, 1).onFinishChange(val => {
    waterOpacity = val;
    ocean.mesh.material.setValues({ opacity: waterOpacity });
});
oceanControlUI.addColor(guiParams, 'waterColor').onFinishChange(val => {
    waterColor = val;
    ocean.mesh.material.setValues({ color: waterColor });
});
oceanControlUI.open();

/* const seasonControlUI = gui.addFolder('Season Controls');
seasonControlUI.add(guiParams, 'Rainy').onChange(GenerateSeason);
seasonControlUI.add(guiParams, 'Winter').onChange(GenerateSeason);
seasonControlUI.open(); */

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

//scenery
function winter()
{
    snowGeo = new THREE.Geometry();
    for (let i = 0; i < 50000; i++)
    {
        //set the position for the snow
        snow = new THREE.Vector3(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 200
        );
        //set the velocity
        snow.velocity = 0.3;
        snowGeo.vertices.push(snow);
    }
    //add texture to the snow
    let snowTexture = new THREE.TextureLoader().load(snowPath);
    let snowMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        map: snowTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    snowSystem = new THREE.Points(snowGeo, snowMaterial);
    scene.add(snowSystem);
    snowAnimation();
}

/*
function rainy()
{
    //create rain
    rainGeo = new THREE.Geometry();
    for(let i=0;i<rainCount;i++) {
        rainDrop = new THREE.Vector3(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 200
        );
        rainDrop.velocity = 0.5;
        rainDrop.velocity = 0;
        rainGeo.vertices.push(rainDrop);
    }

    //add texture to the snow
    let rainTexture = new THREE.TextureLoader().load(rainPath);
    let rainMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        map: rainTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    rainSystem = new THREE.Points(rainGeo,rainMaterial);
    scene.add(rainSystem);
    rainAnimation();
}
*/

//animate the snow
function snowAnimation()
{
    snowGeo.vertices.forEach(p => {
        p.x += (Math.random() - 1) * 0.1;
        p.y += (Math.random() - 0.75) * 0.1;
        p.z += (Math.random()) * 0.1;

        //if the snow go to the max coordinate, it will restart the animation again from the specific coordinate
        if (p.x < -100) {
            p.x = 100;
        }

        if (p.y < -50) {
            p.y = 50;
        }

        if (p.z < -100) {
            p.z = 100;
        }
        if (p.z > 100) {
            p.z = -100;
        }
    });
    //update new position
    snowGeo.verticesNeedUpdate = true;
    renderer.render(scene, camera);
    requestAnimationFrame(snowAnimation);
}

/*
function rainAnimation()
{
    //animate rain
    rainGeo.vertices.forEach(r => {
        r.velocity -= 0.1 + Math.random() * 0.1;
        r.y += r.velocity;
        if (r.y < -50) {
          r.y = 50;
          r.velocity = 0;
        }
      });
      rainGeo.verticesNeedUpdate = true;
      rainSystem.rotation.y += 0.002;
    renderer.render(scene, camera);
    requestAnimationFrame(rainAnimation);
}
*/

// Scene Animation (called 60 times/sec). This should call other functions that updates objects
function animate() {
    fpsCounter.begin();
    islandObject.rotateY(islandRotationSpeed / 100);
    ocean.animateWaves(waveSpeed, waveIntensity);
    renderer.render(scene, camera);
    fpsCounter.end();
    requestAnimationFrame(animate);
}

animate();
winter();
//rainy();
