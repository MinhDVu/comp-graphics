import * as THREE from 'three';
let OrbitControls = require('three-orbit-controls')(THREE);
const PLYLoader = require('threejs-ply-loader')(THREE);

import bunny from '../src/modules/bunny.ply';

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

var ratio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
camera.position.set(0, 0, 20);
camera.lookAt(0, 0, 1);

var materialFloor = new THREE.MeshLambertMaterial();
materialFloor.color = new THREE.Color(0.8, 0.8, 1.0);
materialFloor.side = THREE.DoubleSide;

var geometryPlane = new THREE.PlaneGeometry(10, 10, 10, 10);
var floorMesh = new THREE.Mesh(geometryPlane, materialFloor);
scene.add(floorMesh);

let controls = new OrbitControls(camera, renderer.domElement);

var cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.5);
camera.add(cameralight);
scene.add(camera);

var ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.2);
scene.add(ambientlight);

//MESH LOADING
var loader = new PLYLoader();
var mesh = null;
loader.load(bunny, function (geometry) {
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    var center = geometry.boundingBox.getCenter();
    var size = geometry.boundingBox.getSize();
    var min = geometry.boundingBox.min;

    var sca = new THREE.Matrix4();
    var tra = new THREE.Matrix4();

    var ScaleFact = 5 / size.length();
    sca.makeScale(ScaleFact, ScaleFact, ScaleFact);
    //tra.makeTranslation (-center.x,-center.y,-min.z);
    tra.makeTranslation(-center.x, -center.y, -min.z);

    var material = new THREE.MeshPhongMaterial();
    material.color = new THREE.Color(0.9, 0.9, 0.9);
    material.shininess = 100;
    mesh = new THREE.Mesh(geometry, material);

    mesh.applyMatrix(tra);
    mesh.applyMatrix(sca);

    mesh.name = 'loaded_mesh';

    scene.add(mesh);
});

var MyUpdateLoop = function () {
    renderer.render(scene, camera);
    requestAnimationFrame(MyUpdateLoop);
};

requestAnimationFrame(MyUpdateLoop);

var raycaster = new THREE.Raycaster();

var selectedObj = false;

function onDocumentMouseDown(event) {
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = (-event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children, false);

    if (intersects.length > 0) {
        if (intersects[0].object.name == 'loaded_mesh' && !selectedObj) {
            console.log('Selected!');
            //var FaceI=intersects[ 0 ].face;
            intersects[0].object.material.color = new THREE.Color(1, 0.5, 0.5);
            selectedObj = true;
        }
        if (intersects[0].object.name != 'loaded_mesh' && selectedObj) {
            mesh.material.color = new THREE.Color(0.9, 0.9, 0.9);
            var pos = intersects[0].point;
            console.log('Placed!');
            mesh.position.x = pos.x;
            mesh.position.y = pos.y;
            selectedObj = false;
        }
    }
}

// when the mouse is clicked, call the given function
document.addEventListener('mousedown', onDocumentMouseDown, false);

//this function is called when the window is resized
var MyResize = function () {
    //get the new sizes
    var width = window.innerWidth;
    var height = window.innerHeight;
    //then update the renderer
    renderer.setSize(width, height);
    //and update the aspect ratio of the camera
    camera.aspect = width / height;
    //update the projection matrix given the new values
    camera.updateProjectionMatrix();

    //and finally render the scene again
    renderer.render(scene, camera);
};
//link the resize of the window to the update of the camera
window.addEventListener('resize', MyResize);
