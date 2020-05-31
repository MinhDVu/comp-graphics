import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
// 3D modules import
import islandObjPath from './models/island.obj';
import islandMtlPath from './models/island.mtl';
import { Group } from 'three';

// Declare & Add Objects to Scene here. You can also attach objects to each other and only add the parent object to the scene
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();

/**
 * @deprecated This function needs further adjustments
 * @todo Return mutable Group
 */
export default function buildIsland() {
    let islandObject = new Group();
    mtlLoader.load(islandMtlPath, materials => {
        materials.preload();
        objLoader.setMaterials(materials).load(islandObjPath, object => {
            islandObject = object;
            return islandObject;
        });
    });
}
