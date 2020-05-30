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
                Math.random() * 800,
                (Math.random() - 0.5) * 1600
            );
            snowFlake.velocity = 0.3;
            snowGeometry.vertices.push(snowFlake);
        }

        let snowFlakeTexture = new TextureLoader().load(snowPath);
        let snowMaterial = new PointsMaterial({
            color: 0xffffff,
            size: 5,
            map: snowFlakeTexture,
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
        });

        this.snowSystem = new Points(snowGeometry, snowMaterial);
    }

    animateSnowFlakes() {
        for (let snowFlake of this.snowSystem.geometry.vertices) {
            snowFlake.x += (Math.random() - 1) * 0.1;
            snowFlake.y += Math.random() - 0.75;
            snowFlake.z += Math.random() * 0.1;

            //if the snow go to the max coordinate, it will restart the animation again from the specific coordinate
            if (snowFlake.x < -1600) snowFlake.x = 1600;
            if (snowFlake.x > 1600) snowFlake.x = -1600;
            if (snowFlake.y < -50) snowFlake.y = 500;
            if (snowFlake.z < -1600) snowFlake.z = 1600;
            if (snowFlake.z > 1600) snowFlake.z = -1600;
        }

        this.snowSystem.geometry.verticesNeedUpdate = true;
    }
}
