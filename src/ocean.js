import {
    PlaneGeometry,
    Matrix4,
    MeshPhongMaterial,
    FlatShading,
    Mesh,
    Object3D,
} from 'three';

export default class Ocean extends Object3D {
    /**
     * @description Create an custom object with 2 properties:
     * - A collections of wave verticies
     * - A MeshPhongMaterial for the verticies
     * @params waterColor: A hex color value prefix with '0x'
     * @params oceanHeight: Initial y value for the Object
     * @params waterOpacity: A float from 0 to 1
     */
    constructor(waterColor, oceanHeight, waterOpacity) {
        super();
        //ocean mesh
        let oceanGeometry = new PlaneGeometry(400, 400, 100, 100);
        oceanGeometry.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2));

        //prepare vertices for animation
        oceanGeometry.mergeVertices();

        //array to store ocean vertex data
        this.waves = [];
        for (let i = 0; i < oceanGeometry.vertices.length; i++) {
            let oV = oceanGeometry.vertices[i];
            //gives the vertex some info to create variation in the ocean
            this.waves.push({
                y: oV.y,
                x: oV.x,
                z: oV.z,
                //random angle
                ang: Math.random() * Math.PI * 2,
                // Wave Intensity
                intensity: 0.5 + Math.random() * 0.2,
            });
        }
        //ocean materials
        let oceanMaterial = new MeshPhongMaterial({
            color: waterColor | 0xfff,
            transparent: true,
            opacity: waterOpacity,
            flatShading: FlatShading,
        });

        this.mesh = new Mesh(oceanGeometry, oceanMaterial);
        this.mesh.position.y = oceanHeight;
        this.mesh.receiveShadow = true;
    }

    /**
     * @description Handle wave animations using params
     * @param speed The speed at which waves collide
     * @param intensity The height of each wave
     */
    animateWaves(speed, intensity) {
        let oceanVerts = this.mesh.geometry.vertices;
        for (let i = 0; i < oceanVerts.length; i++) {
            let v = oceanVerts[i];
            //gets vertice data
            let vertProps = this.waves[i];
            //updates vertex positions in a circular motion
            v.x = vertProps.x + Math.cos(vertProps.ang) * intensity;
            v.y = vertProps.y + Math.sin(vertProps.ang) * intensity;
            //increments angle
            vertProps.ang += speed + Math.random() * 0.02;
        }
        this.mesh.geometry.verticesNeedUpdate = true;
    }
}
