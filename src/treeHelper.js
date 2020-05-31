import basicTreePath from './models/basic_tree.ply';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { Vector3, MeshPhongMaterial, Color, Mesh, Matrix4 } from 'three';

const plyLoader = new PLYLoader();
var treePositionsX = [];
var treePositionsY = [];
var addAttempt = 0;
var mesh = null;
var totalDistance;
var percentage;

// generates a random number between 0 and 'limit'
function randomGenerate() {
    var limit = 9;
    var number = Math.floor(Math.random() * limit);
    return number;
}

function generateZ(xValue, yValue) {
    xValue = Math.abs(xValue);
    yValue = Math.abs(yValue);
    totalDistance = Math.sqrt((xValue * xValue) + (yValue * yValue));
    percentage = totalDistance/12.73;
    return 5 - (2 * percentage);
}

// returns a positive or negative value based on whether a randomly generated number is odd or even
function positiveOrNegative() {
    var number = Math.floor(Math.random() * 9) % 2;
    if (number == 0) {
        return -1;
    } else {
        return 1;
    }
}

export function addTree(scene, treeArray) {
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
                if (
                    treePositionX == treePositionsX[i] + j &&
                    treePositionY == treePositionsY[i] + k
                ) {
                    collision = true;
                }
            }
        }
    }

    if (!collision) {
        plyLoader.load(basicTreePath, function (geometry) {
            let material = new MeshPhongMaterial();
            material.color = new Color(0.8, 1, 1);
            material.wireframe = false;
            material.shininess = 100;
            geometry.computeVertexNormals();
            mesh = new Mesh(geometry, material);

            geometry.computeBoundingBox();
            let center = new Vector3();
            let size = new Vector3();
            center = geometry.boundingBox.getCenter(center);
            size = geometry.boundingBox.getSize(size);

            let sca = new Matrix4();
            let tra = new Matrix4();
            let rot = new Matrix4();
            let combined = new Matrix4();
            let zPosition = generateZ(treePositionX, treePositionY);

            sca.makeScale(
                2.5 / size.length(),
                2.5 / size.length(),
                3.5 / size.length()
            );
            tra.makeTranslation(
                -center.x + treePositionX,
                -center.y + treePositionY,
                -center.z + zPosition
            );
            rot.makeRotationX(-Math.PI / 2);
            combined.multiply(rot);
            combined.multiply(sca);
            combined.multiply(tra);

            mesh.applyMatrix4(combined);

            treeArray.push(mesh);
            scene.add(mesh);
            treePositionsX.push(treePositionX);
            treePositionsY.push(treePositionY);
        });
    } else {
        ++addAttempt;
        if (addAttempt < 200) {
            addTree(scene, treeArray);
        }
    }
    addAttempt = 0;
}

export function removeTree(scene, treeArray) {
    scene.remove(treeArray[treeArray.length - 1]);
    treePositionsX.pop();
    treePositionsY.pop();
    treeArray.pop();
}

export function removeAllTrees(scene, treeArray) {
    for (var numberOfTrees = treeArray.length; numberOfTrees > 0; numberOfTrees--) {
        scene.remove(treeArray[treeArray.length -1]);
        treePositionsX.pop();
        treePositionsY.pop();
        treeArray.pop();
    }
}
