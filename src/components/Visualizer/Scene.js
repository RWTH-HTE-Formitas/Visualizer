
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
    this.clickedObjectId = null;
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

        if (intersects.length > 0) {

          self.props.callBack({
            id: intersects[0].object.id,
            name: intersects[0].object.name
          });

          // highlighting
          const obj = self.scene.getObjectById(intersects[0].object.id, true);

          if (self.clickedObjectId !== obj.id) {

            obj.currentHex = obj.material.emissive.getHex();
            obj.material.emissive.setHex(0xffff00);

            // reset previous
            if (self.clickedObjectId != null) {

              const exist = self.scene.getObjectById(self.clickedObjectId, true);

              exist.material.emissive.setHex(exist.currentHex);
            }

            self.clickedObjectId = obj.id;
          }

          if (self.objectSelection === 0) {

            intersects[0].object.material.transparent = true;
            if (intersects[0].object.material.opacity < 1) {

              intersects[0].object.material.opacity = 1;
            }
            else {

              intersects[0].object.material.opacity = 0.3;
            }
          }
          else if (self.objectSelection === 1) {

            /* Object is selected, can be used to add notes etc. */
          }
        }
        else {

          self.props.callBack();

          // reset previous
          if (self.clickedObjectId != null) {

            const exist = self.scene.getObjectById(self.clickedObjectId, true);

            exist.material.emissive.setHex(exist.currentHex);
          }

          self.clickedObjectId = null;
        }
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

    if (this.props.color !== nextProps.color) {

      this.globe.material.color.setHex(nextProps.color);
    }

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

    if (this.props.newObject !== nextProps.newObject) {

      const obj = this.scene.getObjectByName(nextProps.newObject.ID);

      if (this.clickedObjectId !== obj.id) {

        obj.currentHex = obj.material.emissive.getHex();
        obj.material.emissive.setHex(0xffff00);
        
        // reset previous
        if (this.clickedObjectId != null) {

          const exist = this.scene.getObjectById(this.clickedObjectId, true);

          exist.material.emissive.setHex(exist.currentHex);
        }

        this.clickedObjectId = obj.id;
      }
    }

    if (this.props.defects !== nextProps.defects) {

      nextProps.defects.forEach(element => {

        const obj = this.scene.getObjectByName(element.ID);

        if (obj && this.clickedObjectId !== obj.id) {

          obj.currentHex = obj.material.emissive.getHex();

          obj.material.emissive.setHex(0xff0000);
        }
      });
    }
  }
}

export default Scene;
