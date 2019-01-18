
import React, { Component } from "react";
import * as THREE from "three";
import Controls from "camera-controls";
import GLTFLoader from 'three-gltf-loader';

const width = 1000;
const height = 400;

class Scene extends Component {

  constructor(props) {

    super(props);

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.loader = null;

    this.toggleTransparency = false;
    this.highlightedObjectId = null;
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

  componentWillReceiveProps(nextProps) {

    // update camera position & orientation
    if (this.props.camera !== nextProps.camera) {

      const camSet = nextProps.camera;

      const position = new THREE.Vector3(camSet.pX, camSet.pY, camSet.pZ);
      const direction = new THREE.Vector3(camSet.rX - camSet.pX, camSet.rY - camSet.pY, camSet.rZ - camSet.pZ);

      this.navigateCameraTo(position, direction, true);
    }

    // un-/highlight object
    if (this.props.newObject !== nextProps.newObject) {

      this.unSelectObject();

      const object = this.scene.getObjectByName(nextProps.newObject.ID);

      if (object !== null) {

        this.selectObject(object.id);
      }
    }

    // defects loaded/changed
    if (this.props.defects !== nextProps.defects) {

      nextProps.defects.forEach(element => {

        const object = this.scene.getObjectByName(element.ID);

        if (object !== null) {

          this.markDefectObject(object.id);
        }
      });
    }
  }

  /**
   * Marks an object in the scene as having a defect note.
   *
   * @param objectId
   */
  markDefectObject(objectId) {

    const object = this.scene.getObjectById(objectId);

    object.currentHex = object.material.emissive.getHex();
    object.material.emissive.setHex(0xff0000);
  }

  /**
   * Highlights an object in the scene as being currently selected.
   *
   * @param objectId
   */
  selectObject(objectId) {

    this.unSelectObject();

    const object = this.scene.getObjectById(objectId);

    object.currentHex = object.material.emissive.getHex();
    object.material.emissive.setHex(0xffff00);

    // toggle transparency/opacity
    if (this.toggleTransparency === true) {

      object.material.transparent = !object.material.transparent;
      object.material.opacity = (object.material.opacity < 1) ? 1.0 : 0.3;
    }

    this.highlightedObjectId = object.id;
  }

  /**
   * Clears current highlighting if any object is highlighted.
   */
  unSelectObject() {

    if (this.highlightedObjectId !== null) {

      const selectedObject = this.scene.getObjectById(this.highlightedObjectId, true);

      selectedObject.material.emissive.setHex(selectedObject.currentHex);
      selectedObject.material.transparent = false;
      selectedObject.material.opacity = 1.0;

      this.highlightedObjectId = null;
    }
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

      // reset currently selected object
      self.unSelectObject();

      // nothing hit
      if (clickedObject === null) {

        self.props.callBack();

        return;
      }

      self.selectObject(clickedObject.id);

      self.props.callBack({
        id: clickedObject.id,
        name: clickedObject.name
      });
    };
  }

  _onKeyDown(self) {

    return (event) => {

      const moveSpeed = 5;
      const truckSpeed = 0.5;
      const rotationSpeed = 0.5;

      switch (event.key) {

        case "t":

          // Toggle object transparency
          self.toggleTransparency = !self.toggleTransparency;

          break;

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
}

export default Scene;
