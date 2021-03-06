
import React, { Component } from "react";
import * as THREE from "three";
import Controls from "camera-controls";
import GLTFLoader from "three-gltf-loader";
import './Scene.scss'
import { BarLoader } from 'react-spinners';

/**
 * This component loads an external gltf/glb model from a given location and offers easy first-person navigation
 * through the scene.
 *
 * Properties:
 * - url : Location of model file
 * - width/height : In pixels
 * - onLoad : Hook is called when model is fully loaded
 * - onClickObject : Hook is called when an object has been clicked.
 * - onRightClickObject : Hook is called when an object has been right-clicked.
 */
class Scene extends Component {

  constructor(props) {

    super(props);

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.loader = null;

    this.originalAppearances = {};

    this.state = {
      loading: true
    }
  }

  render() {

    return (
      <div ref={el => (this.container = el)} className="scene">
        <BarLoader
          css={`position: absolute !important; margin: 0 auto;`}
          widthUnit={"px"}
          width={300}
          color={'#123abc'}
          loading={this.state.loading}
        />
      </div>
    );
  }

  componentDidMount() {

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera(
      50,
      this.props.width/this.props.height,
      0.1,
      2000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.props.width, this.props.height);
    this.renderer.setClearColor(0xffffff, 1.0);
    this.renderer.domElement.addEventListener("keydown", this._onKeyDown(this), false);
    this.renderer.domElement.setAttribute("tabindex", -1); // required for canvas-element to be focusable which is required for handling keyboard events
    this.renderer.domElement.addEventListener("mousedown", (event) => { event.target.focus(); }, false);
    this.renderer.domElement.addEventListener("mousedown", this._onMouseDown(this), false);
    this.renderer.domElement.addEventListener("mousemove", this._onMouseMove(this), false);
    this.renderer.domElement.addEventListener("mouseup", this._onMouseUp(this), false);

    Controls.install({THREE: THREE});
    this.controls = new Controls(this.camera, this.renderer.domElement);
    this.controls.dollySpeed = 0; // disable dollying/zooming
    this.controls.truckSpeed = 1000;

    // ground
    var geometry = new THREE.PlaneBufferGeometry(30000, 30000);
    var material = new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false });
    var ground = new THREE.Mesh(geometry, material);
    ground.position.set(0, -5, 0);
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // background and fog
    this.scene.background = new THREE.Color(0xa0a0a0);
    this.scene.fog = new THREE.Fog(0xa0a0a0, 70, 200);

    // grid helper
    var grid = new THREE.GridHelper(500, 100, 0x000000, 0x000000);
    grid.position.y = - 5;
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add(grid);

    // light
    var light = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    light.position.set(0, 200, 0);
    this.scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(0, 20, 10);
    light.castShadow = true;
    light.shadow.camera.top = 18;
    light.shadow.camera.bottom = - 10;
    light.shadow.camera.left = - 12;
    light.shadow.camera.right = 12;
    this.scene.add(light);



    // load model
    this.loader = new GLTFLoader();
    this.loader.load(this.props.url, this._onModelLoad(this));

    this.container.appendChild(this.renderer.domElement);

    // start animation cycle
    this._animate(this)(true);
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
   * @param permanent
   * @returns {{color: *, emissive: *, opacity: *}}
   */
  updateObjectAppearance(objectName, settings, permanent) {

    const oldSettings = this.getObjectAppearance(objectName);
    const newSettings = {};

    // save original values
    if (!permanent && !(objectName in this.originalAppearances)) {

      this.originalAppearances[objectName] = this.getObjectAppearance(objectName);
    }

    Object.assign(newSettings, oldSettings);
    Object.assign(newSettings, settings);

    const material = this.scene.getObjectByName(objectName).material;
    material.color.setHex(newSettings.color);
    material.emissive.setHex(newSettings.emissive);
    material.opacity = newSettings.opacity;
    material.transparent = newSettings.opacity < 1.0;

    return oldSettings;
  }

  /**
   * Resets the appearance of the object with the given name to its original settings.
   *
   * @param objectName
   */
  resetObjectAppearance(objectName) {

    if (objectName in this.originalAppearances) {

      this.updateObjectAppearance(objectName, this.originalAppearances[objectName]);

      delete this.originalAppearances[objectName];
    }
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

      throw new Error("Invalid object name given: " + objectName);
    }

    const material = object.material;

    return {
      color: material.color.getHex(),
      emissive: material.emissive.getHex(),
      opacity: material.opacity
    };
  }

  /**
   * Returns the original object appearance as it has been when it has been loaded.
   *
   * @param objectName
   * @returns {{color: *, emissive: *, opacity: *}}
   */
  getOriginalObjectAppearance(objectName) {

    if (objectName in this.originalAppearances) {

      const settings = {};

      Object.assign(settings, this.originalAppearances[objectName]);

      return settings;
    }

    return this.getObjectAppearance(objectName);
  }

  /**
   * Accepts the current appearance as the original one.
   *
   * @param objectName
   */
  markCurrentAppearanceAsOriginal(objectName) {

    if (objectName in this.originalAppearances) {

      delete this.originalAppearances[objectName];
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
      rootObject.position.z = -1 * boxCenter.z;

      // // highlighting edges
      var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );
      rootObject.children.forEach(
        (mesh) => {
          try {
            var geo = new THREE.EdgesGeometry( mesh.geometry );
            var wireframe = new THREE.LineSegments( geo, mat );
            mesh.add(wireframe);
          } catch (error){
            // console.log(error);  // catch error for mesh wtihout buffer geometry
          }
        }
      )

      self.scene.add(rootObject)

      self.navigateCameraTo(boxSize, boxCenter.sub(boxSize));

      self.setState({
        loading: false
      });

      // call hook
      if (self.props.onLoad instanceof Function) {

        self.props.onLoad();
      }
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

  _onMouseDown(self) {

    return () => {

      self.dragging = false;
    };
  }

  _onMouseMove(self) {

    return () => {

      self.dragging = true;
    };
  }

  _onMouseUp(self) {

    return (event) => {

      // only call handlers if not clicked for navigation
      if (!self.dragging) {

        const clickedObject = self._castRayFromCursor(event);

        if (event.button === 0) {

          if (self.props.onClickObject instanceof Function) {

            self.props.onClickObject(clickedObject ? clickedObject.name : null);
          }
        }

        else if (event.button === 2) {

          if (self.props.onRightClickObject instanceof Function) {

            self.props.onRightClickObject(clickedObject ? clickedObject.name : null);
          }
        }
      }

      self.dragging = false;
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

  _castRayFromCursor(event) {

    const mouseVector = new THREE.Vector3(
      (event.offsetX / this.props.width) * 2 - 1,
      -(event.offsetY / this.props.height) * 2 + 1,
      0.5
    );
    mouseVector.unproject(this.camera);

    const raycaster = new THREE.Raycaster(this.camera.position, mouseVector.sub(this.camera.position).normalize());
    const intersects = raycaster.intersectObjects(this.scene.children, true);
    const clickedObject = (intersects.length === 0) ? null : intersects.find(x => x.object.type === "Mesh");

    return clickedObject ? clickedObject.object : null;
  }

  static _objectToVector(object) {

    return (object instanceof THREE.Vector3) ? object : new THREE.Vector3(object.x, object.y, object.z);
  }
}

export default Scene;
