import { CreateObjects } from "./createObjects.js";
import { THREE, OrbitControls } from "./libs_imports.js";
import { Player } from "./player.js";
const audio_footsteps = document.querySelector("#audio_footsteps");
const warn = document.querySelector("#warn");

(() => {
    //Basics Declarations
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer();
    let loaded = false;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector("#main").appendChild(renderer.domElement);

    camera.position.set(5, 5, 5);
    camera.lookAt(scene.position);
    renderer.shadowMap.enabled = true;
    scene.background = new THREE.Color(0x87ceeb);

    //Basics
    //Audio
    audio_footsteps.loop = true;

    //Camera Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2.5;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.minDistance = 3;
    controls.maxDistance = 8;


    //Light
    const AmbientLight = new THREE.AmbientLight(0xffffff, 0.7);
    const DirectionalLight = new THREE.DirectionalLight(0xffffff, 2);
    DirectionalLight.position.set(10, 15, 10)
    DirectionalLight.lookAt(scene.position);
    DirectionalLight.castShadow = true;

    //Player
    const keys = { w: true, s: true, a: true, d: true }
    let player = new Player(new THREE.Vector3(0, 0, 0), 'data/models/Xbot.glb', 2, camera);
    let object;
    let inAnimation = false;

    document.addEventListener("keydown", (e) => {
        if (keys[e.key] && !inAnimation) {
            inAnimation = true;
            player.changeAnim(3);
            player.playFootSounds();
        }
    });

    document.addEventListener("keyup", (e) => {
        if (keys[e.key] && inAnimation) {
            inAnimation = false;
            player.stopAnim();
            player.stopFootSounds();
        }
    });

    setTimeout(() => {
        object = player.getData();
        object.model.castShadow = true;
        object.model.receiveShadow = true;
        scene.add(object.model);
        player.changeAnim(2);

        loaded = true;
        warn.innerText = "";
    }, 1000)
    

    //Box
    const newBox1 = new CreateObjects([0, 0.5, 0], [1, 1, 1], true, 'data/images/box_wood_1.jpeg');
    newBox1.Box();
    const newObjectBox1 = newBox1.getObject();
    newObjectBox1.castShadow = true;

    //Other Box
    const newBox2 = new CreateObjects([2, 1, 6], [2, 2, 2], true, 'data/images/box_wood_1.jpeg');
    newBox2.Box();
    const newObjectBox2 = newBox2.getObject();
    newObjectBox2.castShadow = true;

    //Ground
    const newGround1 = new CreateObjects([0, -0.25, 0], [30, 0.5, 30], true, 'data/images/ground.jpeg');
    newGround1.Box(0xffffff);
    const newObjectGround1 = newGround1.getObject();

    scene.add(newObjectBox1, newObjectBox2, newObjectGround1, AmbientLight, DirectionalLight);

    //Loop
    const Clock = new THREE.Clock();
    function Loop() {
        requestAnimationFrame(Loop);

        controls.update();

        if (loaded) {
            if (object.mixer) {
                object.mixer.update(Clock.getDelta());
            }

            player.update();
            controls.target.set(object.model.position.x, object.model.position.y + 3, object.model.position.z);
        }

        renderer.render( scene, camera );
    }
    Loop();
})()