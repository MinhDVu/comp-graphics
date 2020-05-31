import {
    Points,
    Geometry,
    Vector3,
    TextureLoader,
    PointsMaterial,
    AdditiveBlending,
} from 'three';
import rainPath from './models/rain.png';

export default class Rain {
    constructor(rainDropCount) {
        let rainGeometry = new Geometry();
        // Declare raindrop outside the loop to save memory
        let rainDrop;
        for (let i = 0; i < rainDropCount; i++) {
            rainDrop = new Vector3(
                (Math.random() - 0.5) * 1600,
                Math.random() * 2000,
                (Math.random() - 0.5) * 1600
            );
            rainDrop.velocity = 0.5;
            rainGeometry.vertices.push(rainDrop);
        }

        let rainDropTexture = new TextureLoader().load(rainPath);
        let rainMaterial = new PointsMaterial({
            color: 0xffffff,
            size: 15,
            map: rainDropTexture,
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
        });

        this.rainSystem = new Points(rainGeometry, rainMaterial);
    }

    animateRainDrop() {
        for (let rainDrop of this.rainSystem.geometry.vertices) {
            rainDrop.velocity -= 0.1 + Math.random() * 0.1;
            rainDrop.y += rainDrop.velocity;
            if (rainDrop.y < -50) {
                rainDrop.y = 1000;
                rainDrop.velocity = 0;
            }
        }

        this.rainSystem.geometry.verticesNeedUpdate = true;
        this.rainSystem.rotation.y += 0.0075;
    }
}
