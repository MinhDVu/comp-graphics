import { BoxGeometry, MeshLambertMaterial, Mesh } from 'three';

// This file should be used to initilize complex 3D objects. All functions must return a value and have export at the start of line
export function createPlane(color) {
    const cube = new Mesh(
        new BoxGeometry(100, 100, 1),
        new MeshLambertMaterial({ color: color })
    );

    return cube;
}
