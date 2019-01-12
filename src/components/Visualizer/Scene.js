
import React, { Component } from "react";
import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";
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

    this.objectSelection = 1; // Select mode: 0 = Transparency on, 1 = Object selection on/transparency off
    this.selectedObjectId = null;
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
    this.renderer.domElement.addEventListener("click", function(self) {

      // Either make objects transparent/opaque or select and color them on mouse click event depending on selected mode
      return function(event) {

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
        self.clearObjectHighlight();

        // nothing hit
        if (clickedObject === null) {

          self.props.callBack();

          return;
        }

        self.highlightObject(clickedObject);

        self.props.callBack({
          id: clickedObject.id,
          name: clickedObject.name
        });
      };
      
    }(this), false);
    this.renderer.domElement.addEventListener("keydown", function(self) {
      
      return function(event) {

        const delta = 50;
        const theta = 0.01;
        const zoom = 1.0;

        switch (event.key) {

          case "t":

            // Toggle object transparency
            self.objectSelection = (self.objectSelection === 1) ? 0 : 1;

            break;

          case "ArrowLeft": self.camera.position.x = self.camera.position.x - delta; break;
          case "ArrowUp": self.camera.position.y = self.camera.position.y + delta; break;
          case "ArrowRight": self.camera.position.x = self.camera.position.x + delta; break;
          case "ArrowDown": self.camera.position.y = self.camera.position.y - delta; break;
          case "x": self.camera.position.z = self.camera.position.z + zoom; break;
          case "y": self.camera.position.z = self.camera.position.z - zoom; break;
          case "s": self.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), (-theta)); break;
          case "w": self.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), theta); break;
          case "a": self.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), theta); break;
          case "d": self.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), (-theta)); break;

          default: break;
        }
      };
      
    }(this), false);
    this.renderer.domElement.setAttribute("tabindex", -1); // required for canvas-element to be focusable which is required for handling keyboard events
    this.renderer.domElement.addEventListener("click", function(event) { event.target.focus(); });

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.mouseButtons = {
      ORBIT: THREE.MOUSE.RIGHT,
      ZOOM: THREE.MOUSE.MIDDLE,
      PAN: THREE.MOUSE.LEFT
    };


    let lightA = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    lightA.position.set(1000, 1000, 1000);
    this.scene.add(lightA);

    let lightB = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    lightB.position.set(-1000, 1000, -1000);
    this.scene.add(lightB);


    this.loader = new GLTFLoader();
    this.loader.load(this.props.modelLocation, function(self) {

      return function (gltf) {

        var box = new THREE.Box3().setFromObject(gltf.scene.children[0]);
        var point = new THREE.Vector3();

        gltf.scene.children[0].position.x = -1 * box.getCenter(point).x;
        gltf.scene.children[0].position.y = -1 * box.getCenter(point).y;
        gltf.scene.children[0].position.z = -1 * box.getCenter(point).z;

        self.scene.add(gltf.scene.children[0]);

        self.camera.position.z = box.getSize(point).z * 1.5;
      };

    }(this));

    this.container.appendChild(this.renderer.domElement);


    const animate = function(self) {

      return function() {

        requestAnimationFrame(animate);

        self.controls.update();
        self.renderer.render(self.scene, self.camera);
      };

    }(this);

    animate();
  }

  shouldComponentUpdate() {

    // the canvas has internal state and thus must not be updated
    return false;
  }

  componentWillReceiveProps(nextProps) {

    // update camera position & orientation
    if (this.props.camera !== nextProps.camera) {

      const camSet = nextProps.camera;

      this.camera.position.x = camSet.pX;
      this.camera.position.y = camSet.pY;
      this.camera.position.z = camSet.pZ;

      this.camera.rotation.x = camSet.rX;
      this.camera.rotation.y = camSet.rY;
      this.camera.rotation.z = camSet.rZ;
    }

    // un-/highlight object
    if (this.props.newObject !== nextProps.newObject) {

      this.clearObjectHighlight();

      const object = this.scene.getObjectByName(nextProps.newObject.ID);

      if (object !== null) {

        this.highlightObject(object);
      }
    }

    // defects loaded/changed
    if (this.props.defects !== nextProps.defects) {

      nextProps.defects.forEach(element => {

        const object = this.scene.getObjectByName(element.ID);

        if (object !== null) {

          this.markDefectObject(object);
        }
      });
    }
  }

  markDefectObject(object) {

    object.currentHex = object.material.emissive.getHex();
    object.material.emissive.setHex(0xff0000);
  }

  highlightObject(object) {

    this.clearObjectHighlight();

    object.currentHex = object.material.emissive.getHex();
    object.material.emissive.setHex(0xffff00);

    // toggle opacity
    if (this.objectSelection === 0) {

      object.material.transparent = true;
      object.material.opacity = (object.material.opacity < 1) ? 1.0 : 0.3;
    }

    this.selectedObjectId = object.id;
  }

  clearObjectHighlight() {

    if (this.selectedObjectId !== null) {

      const selectedObject = this.scene.getObjectById(this.selectedObjectId, true);

      selectedObject.material.emissive.setHex(selectedObject.currentHex);

      this.selectedObjectId = null;
    }
  }
}

export default Scene;
