
import React, { Component } from "react";
import * as THREE from "three";
import Controls from "camera-controls";
import GLTFLoader from "three-gltf-loader";

const width = 1000;
const height = 400;

/**
 * This component loads an external gltf/glb model from a given location and offers easy first-person navigation
 * through the scene.
 *
 * Properties:
 *
 * - onClickObject : Hook is called when an object has been clicked.
 */
class Scene extends Component {

  constructor(props) {

    super(props);

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.loader = null;
  }

  render() {

    return (
      <div ref={el => (this.container = el)} className="border" />
    );
  }

  componentDidMount() {

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera(
      50,
      width/height,
      0.1,
      2000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0xffffff, 1.0);
    this.renderer.domElement.addEventListener("click", this._onClick(this), false);
    this.renderer.domElement.addEventListener("keydown", this._onKeyDown(this), false);
    this.renderer.domElement.setAttribute("tabindex", -1); // required for canvas-element to be focusable which is required for handling keyboard events
    this.renderer.domElement.addEventListener("click", (event) => { event.target.focus(); });

    Controls.install({THREE: THREE});
    this.controls = new Controls(this.camera, this.renderer.domElement);
    this.controls.dollySpeed = 0; // disable dollying/zooming
    this.controls.truckSpeed = 1000;


    // add lighting
    const lightA = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    lightA.position.set(1000, 1000, 1000);
    this.scene.add(lightA);

    const lightB = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    lightB.position.set(-1000, 1000, -1000);
    this.scene.add(lightB);

    // load model
    this.loader = new GLTFLoader();
    this.loader.load(this.props.modelLocation, this._onModelLoad(this));

    this.container.appendChild(this.renderer.domElement);

    // start animation cycle
    this._animate(this)(true);
  }

  shouldComponentUpdate() {

    // the canvas has internal state and thus must not be updated
    return false;
  }

  /**
   * Updates the appearance of an scene object. This is abstracted to be independent of Three.js
   * The following settings are available:
   *
   * - color : as hex-code
   * - emissive : as hex-code
   * - opacity : as number e [0, 1]
   *
   * Returns the previous appearance settings.
   *
   * @param objectName
   * @param settings
   * @returns {{color: *, emissive: *, opacity: *}}
   */
  updateObjectAppearance(objectName, settings) {

    const original = this.getObjectAppearance(objectName);
    const newSettings = {};

    Object.assign(newSettings, original);
    Object.assign(newSettings, settings);

    const material = this.scene.getObjectByName(objectName).material;
    material.color.setHex(newSettings.color);
    material.emissive.setHex(newSettings.emissive);
    material.opacity = newSettings.opacity;
    material.transparent = newSettings.opacity < 1.0;

    return original;
  }

  /**
   * Returns the current object appearance settings for the object with the given name.
   *
   * @see updateObjectAppearance
   * @param objectName
   * @returns {{color: *, emissive: *, opacity: *}}
   */
  getObjectAppearance(objectName) {

    const object = this.scene.getObjectByName(objectName);

    if (!object) {

      console.error("Invalid object name given: " + objectName);

      return;
    }

    const material = object.material;

    return {
      color: material.color.getHex(),
      emissive: material.emissive.getHex(),
      opacity: material.opacity
    };
  }

  /**
   * Moves the camera to the given position and viewing direction.
   * If the parameter transition is truthy, the change will be animated.
   *
   * @param position Target position
   * @param direction Viewing direction from position
   * @param transition
   */
  navigateCameraTo(position, direction, transition) {

    position = Scene._objectToVector(position);
    direction = Scene._objectToVector(direction);

    // normalize direction vector to keep navigation consistent
    direction.divideScalar(direction.length() * 10);

    this.controls.setLookAt(
      position.x, position.y, position.z,
      position.x + direction.x, position.y + direction.y, position.z + direction.z,
      transition
    );
  }

  /**
   * Moves the camera forward/backward w.r.t. the current viewing direction.
   * Positive values move the camera forward, negative values move the camera backward.
   *
   * todo: generalize to any direction using vector argument
   *
   * @param distance
   */
  moveForward(distance) {

    const target = this.controls.getPosition().add(
      this._getCurrentCameraDirection().multiplyScalar(distance)
    );

    this.navigateCameraTo(target, this._getCurrentCameraDirection(), true);
  }

  _getCurrentCameraDirection() {

    return this.controls.getTarget().sub(this.controls.getPosition());
  }

  _onModelLoad(self) {

    return (gltf) => {

      const rootObject = gltf.scene.children[0];
      const box = new THREE.Box3().setFromObject(rootObject);
      const boxCenter = box.getCenter(new THREE.Vector3());
      const boxSize = box.getSize(new THREE.Vector3());

      // move model to world center
      rootObject.position.x = -1 * boxCenter.x;
      rootObject.position.y = -1 * boxCenter.y;
      rootObject.position.z = -1 * boxCenter.z;

      self.scene.add(rootObject);

      self.navigateCameraTo(boxSize, boxCenter.sub(boxSize));
    };
  }

  _animate(self) {

    const clock = new THREE.Clock();

    const animate = (forceRendering = false) => {

      const delta = clock.getDelta();
      const updated = self.controls.update(delta);

      requestAnimationFrame(animate);

      if (forceRendering || updated) {

        self.renderer.render(self.scene, self.camera);
      }
    };

    return animate;
  }

  _onClick(self) {

    // Either make objects transparent/opaque or select and color them on mouse click event depending on selected mode
    return (event) => {

      const mouseVector = new THREE.Vector3(
        (event.offsetX / width) * 2 - 1,
        -(event.offsetY / height) * 2 + 1,
        0.5
      );
      mouseVector.unproject(self.camera);

      const raycaster = new THREE.Raycaster(self.camera.position, mouseVector.sub(self.camera.position).normalize());
      const intersects = raycaster.intersectObjects(self.scene.children, true);
      const clickedObject = (intersects.length === 0) ? null : intersects[0].object;

      // call hook
      if (self.props.onClickObject instanceof Function) {

        self.props.onClickObject(clickedObject ? clickedObject.name : null);
      }
    };
  }

  _onKeyDown(self) {

    return (event) => {

      const moveSpeed = 5;
      const truckSpeed = 0.5;
      const rotationSpeed = 0.5;

      switch (event.key) {

        case "ArrowLeft": self.controls.rotate(rotationSpeed, 0, true); break;
        case "ArrowRight": self.controls.rotate(-rotationSpeed, 0, true); break;
        case "s": case "ArrowDown": self.moveForward(-moveSpeed); break;
        case "w": case "ArrowUp": self.moveForward(moveSpeed); break;
        case "a": self.controls.truck(-truckSpeed, 0, true); break;
        case "d": self.controls.truck(truckSpeed, 0, true); break;

        default: break;
      }
    };
  }

  static _objectToVector(object) {

    return (object instanceof THREE.Vector3) ? object : new THREE.Vector3(object.x, object.y, object.z);
  }
}

export default Scene;
