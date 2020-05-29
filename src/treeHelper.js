import * as THREE from 'three';
import basicTreePath from './models/basic_tree.ply';
// generates a random number between 0 and 'limit'
function randomGenerate() {
  var limit = 10;
  var number = Math.floor(Math.random() * limit);
  return number;
}

// returns a positive or negative value based on whether a randomly generated number is odd or even
function positiveOrNegative() {
  var number = (Math.floor(Math.random() * 10)) % 2;
  if (number == 0) {
    return -1;
  } else {
    return 1;
  }
}

var treePositionsX = [];
var treePositionsY = [];
var addAttempt = 0;
var mesh = null;

export function addTree(scene, treeArray, loader) {
  // Generates a + or - sign to determine the polairty of the coordinates
  var signX = positiveOrNegative();
  var signY = positiveOrNegative();
  // Generates a random position for the x and y coordinates and then determines the polarity based on the sign variable
  var treePositionX = signX * randomGenerate();
  var treePositionY = signY * randomGenerate();

  var collision = false;
  for (var i = 0; i < treePositionsX.length; ++i) {
    for (var j = -3; j <= 3; ++j) {
      for (var k = -2; k <= 2; ++k) {
        if (treePositionX == treePositionsX[i] + j && treePositionY == treePositionsY[i] + k) {
          collision = true;
        }
      }
    }
  }

  if (!collision) {
    loader.load(basicTreePath, function (geometry) {
      var material = new THREE.MeshPhongMaterial();
      material.color = new THREE.Color(0.8, 1, 1);
      material.wireframe = false;
      material.shininess = 100;
      geometry.computeVertexNormals();
      mesh = new THREE.Mesh(geometry, material);

      geometry.computeBoundingBox();
      var center = geometry.boundingBox.getCenter();
      var size = geometry.boundingBox.getSize();

      var sca = new THREE.Matrix4();
      var tra = new THREE.Matrix4();
      var rot = new THREE.Matrix4();
      var combined = new THREE.Matrix4();

      sca.makeScale(2.5 / size.length(), 2.5 / size.length(), 3 / size.length());
      tra.makeTranslation(-center.x + treePositionX, -center.y + treePositionY, -center.z + 5);
      rot.makeRotationX(-Math.PI / 2);
      combined.multiply(rot);
      combined.multiply(sca);
      combined.multiply(tra);

      mesh.applyMatrix(combined);

      treeArray.push(mesh);
      scene.add(mesh);
      treePositionsX.push(treePositionX);
      treePositionsY.push(treePositionY);
    })
  }
  else {
    ++addAttempt;
    if (addAttempt < 200) {
      addTree();
    }
  }
  addAttempt = 0;
}

export function removeTree(scene, treeArray) {
  scene.remove(treeArray[treeArray.length - 1]);
  treeArray.pop();
}
