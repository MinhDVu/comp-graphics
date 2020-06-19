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
        //create loop for each vertex
        for (let i = 0; i < rainDropCount; i++) {
            rainDrop = new Vector3(
                (Math.random() - 0.5) * 1600,
                (Math.random() - 0.5) * 800,
                (Math.random() - 0.5) * 1600
            );
            //rainDrop.velocity = {};
            rainDrop.velocity = 0;
            //push the vertex to the geometry
            rainGeometry.vertices.push(rainDrop);
        }

        //load texture for the rainDrop
        let rainDropTexture = new TextureLoader().load(rainPath);
        let rainMaterial = new PointsMaterial({
            size: 7,
            map: rainDropTexture,
            transparent: true,
            blending: AdditiveBlending,
            //for 2D overlays, this is to layer several things together without creating z-index artifacts
            depthWrite: false,
        });

        this.rainSystem = new Points(rainGeometry, rainMaterial);
    }

    animateRainDrop() {
        for (let rainDrop of this.rainSystem.geometry.vertices) {
            rainDrop.velocity -= 0.9 + Math.random() * 0.9;
            //increase the velocity along with the gravity
            rainDrop.y += rainDrop.velocity;
            if (rainDrop.y < -400) {
                rainDrop.y = 400;
                rainDrop.velocity = 0;
            }
        }
        this.rainSystem.geometry.verticesNeedUpdate = true;
    }
}
