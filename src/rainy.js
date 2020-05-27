let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);

camera.position.z = 1;

scene.background = new THREE.Color(0x0a0a0a);
let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera,renderer.domElement);

window.addEventListener('resize', function() 
{
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    camera.aspect = this.window.innerWidth/this.window.innerHeight;
});

let cloudParticles = [], rainSystem, rainGeo, rainCount = 15000;

function rainy()
{
    //create rain
    rainGeo = new THREE.Geometry();
    for(let i=0;i<rainCount;i++) {
        rainDrop = new THREE.Vector3(
            Math.random() * 400 -200,
            Math.random() * 500 - 250,
            Math.random() * 400 - 200
        );
        rainDrop.velocity = {};
        rainDrop.velocity = 0;
        rainGeo.vertices.push(rainDrop);
    }

    rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true
    });

    rainSystem = new THREE.Points(rainGeo,rainMaterial);
    scene.add(rainSystem);

    //create cloud
    let cloudLoader = new THREE.TextureLoader();
    cloudLoader.load('textures/smoke.png', function(cloudTexture) {
        cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
        cloudMaterial = new THREE.MeshLambertMaterial({
            map: cloudTexture,
            transparent: true
        });
        
        for(let c=0; c<25; c++) {
            let cloudSystem = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloudSystem.position.set(
                Math.random()* 800 - 400,
                500,
                Math.random()*500-450
            );
            cloudSystem.rotation.x = 1.16;
            cloudSystem.rotation.y = -0.12;
            cloudSystem.rotation.z = Math.random()*360;
            cloudSystem.material.opacity = 0.6;
            cloudParticles.push(cloudSystem);
            scene.add(cloudSystem);
        }
    rainAnimation();
    });
}

function rainAnimation()
{
    //animate cloud
    cloudParticles.forEach(c => {
        c.rotation.z -= 0.002;
    });

    //animate rain
    rainGeo.vertices.forEach(r => {
        r.velocity -= 0.1 + Math.random() * 0.1;
        r.y += r.velocity;
        if (r.y < -200) {
          r.y = 200;
          r.velocity = 0;
        }
      });
      rainGeo.verticesNeedUpdate = true;
      rainSystem.rotation.y +=0.002;
    renderer.render(scene, camera);
    requestAnimationFrame(rainAnimation);
}

rainy();


