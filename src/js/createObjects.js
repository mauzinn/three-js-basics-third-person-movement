import { THREE } from "./libs_imports.js";

export class CreateObjects {
    constructor([x, y, z], [size_x, size_y, size_z], need_textures, texture_url) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.size_x = size_x;
        this.size_y = size_y;
        this.size_z = size_z;
        this.need_textures = need_textures;
        this.texture_url = texture_url;
        this.newBox;
        this.textureLoader = new THREE.TextureLoader();
    }

    Box(color) {
        let material;
        if (this.need_textures) {
            material = new THREE.MeshStandardMaterial({ map: this.textureLoader.load(this.texture_url) });
        } else {
            material = new THREE.MeshStandardMaterial({ color: color });
        }

        this.newBox = new THREE.Mesh(new THREE.BoxGeometry(this.size_x, this.size_y, this.size_z), material);
        this.newBox.receiveShadow = true;
        this.newBox.position.set(this.x, this.y, this.z);
    }

    getObject() {
        return this.newBox;
    }
}