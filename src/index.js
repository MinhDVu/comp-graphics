import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
const OrbitControls = require('three-orbit-controls')(THREE);

// Import utility functions from utility.js

// 3D modules import
import islandObjPath from './models/island.obj';
import islandMtlPath from './models/island.mtl';
import { createSkyboxNight, createSkyboxDay } from './skyboxHelper';

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

// Basic Lighting
const cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.8);
cameralight.castShadow = true;
camera.add(cameralight);
scene.add(camera);

// Ambient Lighting
const ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.55);
scene.add(ambientLight);

// Declare scene control variables here (ie: number of trees, color of leaves)
let numberOfTrees = 1;
let colorOfLeaves = '#2dc89b';
let islandRotationSpeed = 0;
let isDayOrNight = 'day';
let oceanHeight = 0.14;

// Scene Background
const skyboxDay = createSkyboxDay();
const skyboxNight = createSkyboxNight();
scene.add(skyboxDay);

function setDayAndNight(val) {
    if (val === 'night') {
        scene.add(skyboxNight);
        scene.remove(skyboxDay);
    } else if (val === 'day') {
        scene.add(skyboxDay);
        scene.remove(skyboxNight);
    }
}

// Scene GUI. Should use variables from above
const gui = new dat.GUI();
const params = {
    numberOfTrees: numberOfTrees,
    colorOfLeaves: colorOfLeaves,
    plainRotationSpeed: islandRotationSpeed,
    isDayOrNight: isDayOrNight,
    oceanHeight: oceanHeight,
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

const environmentControlUI = gui.addFolder('environmentControls');
environmentControlUI
    .add(params, 'isDayOrNight', ['day', 'night'])
    .onFinishChange(val => {
        setDayAndNight(val);
        isDayOrNight = val;
    });
environmentControlUI.open();

const oceanControlUI = gui.addFolder('Ocean Controls');
oceanControlUI
    .add(params, 'oceanHeight', -1, 1)
    .onFinishChange(val => {
        oceanHeight = val;
    });
oceanControlUI.open();

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
    //BEGINNING HEINS CODE
//Building the ocean
function Ocean(){
    //ocean mesh
    var oceanGeom = new THREE.PlaneGeometry(500, 500, 180, 180);
    oceanGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    //prepare vertices for animation
    oceanGeom.mergeVertices();
    var l = oceanGeom.vertices.length;

    //array to store ocean vertex data
    this.waves = [];
    for (var i = 0; i < l; i++){
		var oV = oceanGeom.vertices[i];

		//gives the vertex some info to create variation in the ocean
		this.waves.push({y:oV.y,
						x:oV.x,
						z:oV.z,
						//random angle
						ang:Math.random()*Math.PI*2,
						//random distance
						amp:0.05 + Math.random()*0.2,
						//random speed for vertexes
						speed:0.004 + Math.random()*0.012
					});
	}

    //ocean materials
    var oceanMat = new THREE.MeshPhongMaterial({
        color:0x68c3c0,
        transparent:true,
        opacity:0.9,
        shading:THREE.FlatShading,
    });

    this.mesh = new THREE.Mesh(oceanGeom, oceanMat);

    this.mesh.receiveShadow = true;

    //function that animates the waves
    Ocean.prototype.animWaves = function (){
	
        //gets vertices
        var oceanVerts = this.mesh.geometry.vertices;
        var len = oceanVerts.length;
        
        for (var i=0; i<len; i++){
            var v = oceanVerts[i];
            
            //gets vertice data
            var vertProps = this.waves[i];
            
            //updates vertex positions in a circular motion
            v.x = vertProps.x + Math.cos(vertProps.ang)*vertProps.amp;
            v.y = vertProps.y + Math.sin(vertProps.ang)*vertProps.amp;
    
            //increments angle
            vertProps.ang += vertProps.speed;
    
        }

    this.mesh.geometry.verticesNeedUpdate=true;

    }
}

// Instantiating the ocean
var ocean;

function createOcean(){
	ocean = new Ocean();
    ocean.mesh.position.y = oceanHeight;
	scene.add(ocean.mesh);
}

createOcean();
    //ENDING HEINS CODE

// Scene Animation (called 60 times/sec). This should call other functions that updates objects
function animate() {
    requestAnimationFrame(animate);
    islandObject.rotateY(islandRotationSpeed / 100);
    renderer.render(scene, camera);
    ocean.animWaves();
    ocean.mesh.position.y = oceanHeight;
}
animate();
