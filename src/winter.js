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
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 200
            );
            snowFlake.velocity = 0.3;
            snowGeometry.vertices.push(snowFlake);
        }

        let snowFlakeTexture = new TextureLoader().load(snowPath);
        let snowMaterial = new PointsMaterial({
            color: 0xffffff,
            size: 0.7,
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
            snowFlake.y += (Math.random() - 0.75) * 0.1;
            snowFlake.z += Math.random() * 0.1;

            //if the snow go to the max coordinate, it will restart the animation again from the specific coordinate
            if (snowFlake.x < -100) snowFlake.x = 100;
            if (snowFlake.y < -50) snowFlake.y = 50;
            if (snowFlake.z < -100) snowFlake.z = 100;
            if (snowFlake.z > 100) snowFlake.z = -100;
        }

        this.snowSystem.geometry.verticesNeedUpdate = true;
    }
}
