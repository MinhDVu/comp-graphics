
import treeMtlPath from './models/basic_tree.mtl';
import treeObjPath from './models/basic_tree.obj';
import { Group } from 'three';

var treePositionsX = [];
var treePositionsZ = [];
var addAttempt = 0;
var totalDistance;
var percentage;

// generates a random number between 0 and 'limit'
function randomGenerate() {
    var limit = 10;
    var number = Math.floor(Math.random() * limit);
    return number;
}

function generateY(xValue, zValue) {
    xValue = Math.abs(xValue);
    zValue = Math.abs(zValue);
    totalDistance = Math.sqrt((xValue * xValue) + (zValue * zValue));
    percentage = totalDistance/12.73;
    return 1.3  - (1.2 * percentage);
}

function generateYRot() {
    var limit = 2;
    var number = Math.random() * limit;
    return number;
}

// returns a positive or negative value based on whether a randomly generated number is odd or even
function positiveOrNegative() {
    var number = Math.floor(Math.random() * 10) % 2;
    if (number == 0) {
        return -1;
    } else {
        return 1;
    }
}

export function addTree(scene, treeArray, objLoader, mtlLoader) {
    // Generates a + or - sign to determine the polairty of the coordinates
    var signX = positiveOrNegative();
    var signZ = positiveOrNegative();
    // Generates a random position for the x and z coordinates and then determines the polarity based on the sign variable
    var treePositionX = signX * randomGenerate();
    var treePositionZ = signZ * randomGenerate();

    var collision = false;
    for (var i = 0; i < treePositionsX.length; ++i) {
        for (var j = -3; j <= 3; ++j) {
            for (var k = -3; k <= 3; ++k) {
                if (
                    treePositionX == treePositionsX[i] + j &&
                    treePositionZ == treePositionsZ[i] + k
                ) {
                    collision = true;
                }
            }
        }
    }

    if (!collision) {
        let treePositionY = generateY(treePositionX, treePositionZ);
        let yRotation = generateYRot();
        let treeObject = new Group();
        mtlLoader.load(treeMtlPath, materials => {
            materials.preload();
            objLoader.setMaterials(materials).load(treeObjPath, object => {
                treeObject = object;

                treeObject.rotateY(Math.PI * yRotation);
                treeObject.scale.x = treeObject.scale.z = 0.4;
                treeObject.scale.y = 0.5;
                treeObject.translateX(treePositionX * 0.35);
                treeObject.translateZ(treePositionZ * 0.35);
                treeObject.translateY(treePositionY);
                treeArray.push(treeObject);
                treePositionsX.push(treePositionX);
                treePositionsZ.push(treePositionZ);
                scene.add(treeObject);
            });
        });
    } else {
        ++addAttempt;
        if (addAttempt < 200) {
            addTree(scene, treeArray, objLoader, mtlLoader);
        }
    }
    addAttempt = 0;
}

export function removeTree(scene, treeArray) {
    scene.remove(treeArray[treeArray.length - 1]);
    treePositionsX.pop();
    treePositionsZ.pop();
    treeArray.pop();
}

export function removeAllTrees(scene, treeArray) {
    for (var numberOfTrees = treeArray.length; numberOfTrees > 0; numberOfTrees--) {
        scene.remove(treeArray[treeArray.length -1]);
        treePositionsX.pop();
        treePositionsZ.pop();
        treeArray.pop();
    }
}
