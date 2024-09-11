import { inputController } from "./input_controller.js";
import { GLTFLoader, THREE } from "./libs_imports.js";
const audio_footsteps = document.querySelector("#audio_footsteps");

export class Player {
    constructor(position, model_url, scale, camera) {
        this.position = position;
        this.model_url = model_url;
        this.scale = scale;
        this.action = null;
        this.setup();
        this.camera = camera;
        this.inputController = new inputController();
        this.animation = false;
        this.rotation = new THREE.Vector3();
    }

    setup() {
        new GLTFLoader().load(this.model_url, (model_gltf) => {
            const scene = model_gltf.scene;
            scene.scale.set(this.scale, this.scale, this.scale);
            this.object = { model: scene, animations: model_gltf.animations, mixer: new THREE.AnimationMixer(scene) };
        })
    }

    getData() {
        return this.object;
    }

    changeAnim(animationId) {
        if (this.action != null) {
            this.action.stop();
        }

        this.action = this.object.mixer.clipAction(this.object.animations[animationId]);
        this.action.play();
    }

    stopAnim() {
        this.action.stop();
        this.action = this.object.mixer.clipAction(this.object.animations[2]);
        this.action.play();
    }

    update() {
        this.updateMovement();
        this.updateRotation();
    }

    updateRotation() {
        if (this.inputController.isMoving) {
            const newRotation = Math.atan2(this.rotation.x, this.rotation.z);
            this.object.model.rotation.y = newRotation;
        }
    }

    addPosition(forward, strafe) {
        this.object.model.position.add(forward);
        this.object.model.position.add(strafe);
        this.camera.position.add(forward);
        this.camera.position.add(strafe);

        this.rotation.addVectors(forward, strafe);
    }

    updateMovement() {
        const forwardV = (this.inputController.keys.w ? 1 : 0) + (this.inputController.keys.s ? -1 : 0);
        const strafeV = (this.inputController.keys.a ? 1 : 0) + (this.inputController.keys.d ? -1 : 0);

        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.camera.quaternion);
        forward.normalize();
        const strafe = new THREE.Vector3(-1, 0, 0);
        strafe.applyQuaternion(this.camera.quaternion);
        strafe.normalize();

        forward.y = 0;
        strafe.y = 0;

        const speed = 0.16;
        const moveForward = forward.multiplyScalar(forwardV * speed);
        const moveStrafe = strafe.multiplyScalar(strafeV * speed);

        this.addPosition(moveForward, moveStrafe);
    }

    playFootSounds() {
        audio_footsteps.play();
    }

    stopFootSounds() {
        audio_footsteps.pause();
    }
}