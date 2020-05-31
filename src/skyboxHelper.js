import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    BackSide,
    TextureLoader,
} from 'three';

// Scene Background import
import skyboxNightbkPath from './background/night-time/skyboxNight-bk.png';
import skyboxNightdnPath from './background/night-time/skyboxNight-dn.png';
import skyboxNightftPath from './background/night-time/skyboxNight-ft.png';
import skyboxNightlfPath from './background/night-time/skyboxNight-lf.png';
import skyboxNightrtPath from './background/night-time/skyboxNight-rt.png';
import skyboxNightupPath from './background/night-time/skyboxNight-up.png';

import skyboxDaybkPath from './background/day-time/skyboxDay-bk.jpg';
import skyboxDaydnPath from './background/day-time/skyboxDay-dn.jpg';
import skyboxDayftPath from './background/day-time/skyboxDay-ft.jpg';
import skyboxDaylfPath from './background/day-time/skyboxDay-lf.jpg';
import skyboxDayrtPath from './background/day-time/skyboxDay-rt.jpg';
import skyboxDayupPath from './background/day-time/skyboxDay-up.jpg';

const skyboxTextureLoader = new TextureLoader();
const skyboxBoxGeometry = new BoxGeometry(10000, 10000, 10000);

export function createSkyboxNight() {
    let skyboxNightMaterials = [];
    const skyboxNightft = skyboxTextureLoader.load(skyboxNightftPath);
    const skyboxNightbk = skyboxTextureLoader.load(skyboxNightbkPath);
    const skyboxNightup = skyboxTextureLoader.load(skyboxNightupPath);
    const skyboxNightdn = skyboxTextureLoader.load(skyboxNightdnPath);
    const skyboxNightrt = skyboxTextureLoader.load(skyboxNightrtPath);
    const skyboxNightlf = skyboxTextureLoader.load(skyboxNightlfPath);

    skyboxNightMaterials.push(new MeshBasicMaterial({ map: skyboxNightft }));
    skyboxNightMaterials.push(new MeshBasicMaterial({ map: skyboxNightbk }));
    skyboxNightMaterials.push(new MeshBasicMaterial({ map: skyboxNightup }));
    skyboxNightMaterials.push(new MeshBasicMaterial({ map: skyboxNightdn }));
    skyboxNightMaterials.push(new MeshBasicMaterial({ map: skyboxNightrt }));
    skyboxNightMaterials.push(new MeshBasicMaterial({ map: skyboxNightlf }));

    for (let i = 0; i < 6; i++) {
        skyboxNightMaterials[i].side = BackSide;
    }

    return new Mesh(skyboxBoxGeometry, skyboxNightMaterials);
}

export function createSkyboxDay() {
    let skyboxDayMaterials = [];
    const skyboxDayft = skyboxTextureLoader.load(skyboxDayftPath);
    const skyboxDaybk = skyboxTextureLoader.load(skyboxDaybkPath);
    const skyboxDayup = skyboxTextureLoader.load(skyboxDayupPath);
    const skyboxDaydn = skyboxTextureLoader.load(skyboxDaydnPath);
    const skyboxDayrt = skyboxTextureLoader.load(skyboxDayrtPath);
    const skyboxDaylf = skyboxTextureLoader.load(skyboxDaylfPath);

    skyboxDayMaterials.push(new MeshBasicMaterial({ map: skyboxDayft }));
    skyboxDayMaterials.push(new MeshBasicMaterial({ map: skyboxDaybk }));
    skyboxDayMaterials.push(new MeshBasicMaterial({ map: skyboxDayup }));
    skyboxDayMaterials.push(new MeshBasicMaterial({ map: skyboxDaydn }));
    skyboxDayMaterials.push(new MeshBasicMaterial({ map: skyboxDayrt }));
    skyboxDayMaterials.push(new MeshBasicMaterial({ map: skyboxDaylf }));

    for (let i = 0; i < 6; i++) {
        skyboxDayMaterials[i].side = BackSide;
    }

    return new Mesh(skyboxBoxGeometry, skyboxDayMaterials);
}
