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

let snowGeo, snowSystem;

function winter()
{
    snowGeo = new THREE.Geometry();
    for (let i = 0; i < 12000; i++)
    {
        snow = new THREE.Vector3(
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 300
        );
        snow.velocity = 0.3;
        snowGeo.vertices.push(snow);
    }
    let snowTexture = new THREE.TextureLoader().load('textures/snow.png');
    let snowMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        map: snowTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    snowSystem = new THREE.Points(snowGeo, snowMaterial);
    scene.add(snowSystem);
    snowAnimation();
}

function snowAnimation()
{
    snowGeo.vertices.forEach(p => {
        p.x += (Math.random() - 1) * 0.1;
        p.y += (Math.random() - 0.75) * 0.1;
        p.z += (Math.random()) * 0.1;

        if (p.x < -150) {
            p.x = 150;
        }

        if (p.y < -50) {
            p.y = 50;
        }

        if (p.z < -150) {
            p.z = 150;
        }

        if (p.z > 150) {
            p.z = -150;
        }
    });
    //update new position
    snowGeo.verticesNeedUpdate = true;
    snowSystem.rotation.x += 0.002;
    renderer.render(scene, camera);
    requestAnimationFrame(snowAnimation);
}

winter();


