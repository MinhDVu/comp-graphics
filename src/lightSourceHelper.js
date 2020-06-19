import { SphereGeometry, Mesh, MeshBasicMaterial, TextureLoader } from 'three';

import moonMaterialPath from './background/material-moon.png';
import sunMaterialPath from './background/material-sun.png';

const textureLoader = new TextureLoader();
const moonMaterial = textureLoader.load(moonMaterialPath);
const sunMaterial = textureLoader.load(sunMaterialPath);

export function buildRadiantSphere(size, color, isSun) {
    const sphereGeometry = new SphereGeometry(size, size, size);
    const SphereMaterial = new MeshBasicMaterial({
        color: color,
        shininess: 1,
        map: isSun ? sunMaterial : moonMaterial,
    });

    return new Mesh(sphereGeometry, SphereMaterial);
}
