import {
    Geometry,
    Vector3,
    TextureLoader,
    PointsMaterial,
    AdditiveBlending,
    Points,
} from 'three';
import snowPath from './models/snow.png';

export default class Snow {
    constructor(snowflakeCount) {
        let snowGeometry = new Geometry();
        for (let i = 0; i < snowflakeCount; i++) {
            let snowFlake = new Vector3(
                (Math.random() - 0.5) * 1600,
                (Math.random() - 0.5) * 800,
                (Math.random() - 0.5) * 1600
            );
            //push the vertex to the geometry
            snowGeometry.vertices.push(snowFlake);
        }

        let snowFlakeTexture = new TextureLoader().load(snowPath);
        let snowMaterial = new PointsMaterial({
            size: 7,
            map: snowFlakeTexture,
            transparent: true,
            blending: AdditiveBlending,
            //for 2D overlays, this is to layer several things together without creating z-index artifacts
            depthWrite: false,
        });
        //create snow system
        this.snowSystem = new Points(snowGeometry, snowMaterial);
    }

    animateSnowFlakes() {
        for (let snowFlake of this.snowSystem.geometry.vertices) {
            snowFlake.x += (Math.random() - 1) * 0.1;
            snowFlake.y += Math.random() - 0.7;
            snowFlake.z += Math.random() * 0.3;

            //if the snow go to the max coordinate, it will restart the animation again from the specific coordinate
            if (snowFlake.x < -800) {
                snowFlake.x = 800;
            }
            //if (snowFlake.x > 1600) snowFlake.x = -1600;
            if (snowFlake.y < -400) {
                snowFlake.y = 400;
            }
            if (snowFlake.z < -800) {
                snowFlake.z = 800;
            }
            if (snowFlake.z > 800) {
                snowFlake.z = -800;
            }
        }
        this.snowSystem.geometry.verticesNeedUpdate = true;
    }
}
