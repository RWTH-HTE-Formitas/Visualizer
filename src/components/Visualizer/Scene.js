
import React, { Component } from "react";
import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";
import GLTFLoader from 'three-gltf-loader';

const width = 1000;
const height = 400;

class Scene extends Component {

  render() {

    return (
      <div ref={el => (this.container = el)} className="border" />
    );
  }

  clickedObjectId = null;
  scene = null;
  camera = null;

  componentDidMount() {

    var self = this;
    var scene, camera, renderer, controls, loader;
    var objectSelection = 1; // Select mode: 0 = Transparency on, 1 = Object selection on/transparency off

    init();
    animate();

    function init() {

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      camera = new THREE.PerspectiveCamera(
        50,
        width/height,
        0.1,
        2000
      );

      self.scene = scene;
      self.camera = camera;

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setClearColor(0xffffff, 1.0);
      renderer.domElement.addEventListener('click', onClick, false);
      renderer.domElement.addEventListener("keydown", onKeyDown);
      renderer.domElement.setAttribute("tabindex", -1); // required for canvas-element to be focusable which is required for handling keyboard events
      renderer.domElement.addEventListener("click", function(event) { event.target.focus(); });

      controls = new OrbitControls(camera, renderer.domElement);
      controls.mouseButtons = {
          ORBIT: THREE.MOUSE.RIGHT,
          ZOOM: THREE.MOUSE.MIDDLE,
          PAN: THREE.MOUSE.LEFT
      };


      let lightA = new THREE.HemisphereLight(0xbbbbff, 0x444422);
      lightA.position.set(1000, 1000, 1000);
      scene.add(lightA);

      let lightB = new THREE.HemisphereLight(0xbbbbff, 0x444422);
      lightB.position.set(-1000, 1000, -1000);
      scene.add(lightB);
      

      loader = new GLTFLoader();
      loader.load(self.props.modelLocation, function (gltf) {

        var box = new THREE.Box3().setFromObject(gltf.scene.children[0]);
        var point = new THREE.Vector3();

        gltf.scene.children[0].position.x = -1 * box.getCenter(point).x;
        gltf.scene.children[0].position.y = -1 * box.getCenter(point).y;
        gltf.scene.children[0].position.z = -1 * box.getCenter(point).z;

        scene.add(gltf.scene.children[0]);

        camera.position.z = box.getSize(point).z * 1.5;
      });

      self.container.appendChild(renderer.domElement);
    }

    function animate() {

      requestAnimationFrame(animate);

      renderer.render(scene, camera);
    }

    function onKeyDown(event) {console.log(event);

      var delta = 50;
      var theta = 0.01;
      var zoom = 1.0;

      switch (event.key) {

        case "t":

          // Toggle object transparency
          objectSelection = (objectSelection === 1) ? 0 : 1;

          break;

        case "ArrowLeft": camera.position.x = camera.position.x - delta; break;
        case "ArrowUp": camera.position.y = camera.position.y + delta; break;
        case "ArrowRight": camera.position.x = camera.position.x + delta; break;
        case "ArrowDown": camera.position.y = camera.position.y - delta; break;
        case "x": camera.position.z = camera.position.z + zoom; break;
        case "y": camera.position.z = camera.position.z - zoom; break;
        case "s": camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), (-theta)); break;
        case "w": camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), theta); break;
        case "a": camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), theta); break;
        case "d": camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), (-theta)); break;

        default: break;
      }
    }

    // Either make objects transparent/opaque or select and color them on mouse click event depending on selected mode
    function onClick(event) {

      var mouseVector = new THREE.Vector3(
        (event.offsetX / width) * 2 - 1,
        -(event.offsetY / height) * 2 + 1,
        0.5
      );
      mouseVector.unproject(camera);

      var raycaster = new THREE.Raycaster(camera.position, mouseVector.sub(camera.position).normalize());
      var intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {

        self.props.callBack({
          id: intersects[0].object.id,
          name: intersects[0].object.name
        });

        // highlighting
        const obj = scene.getObjectById(intersects[0].object.id, true);

        if (self.clickedObjectId !== obj.id) {

          obj.currentHex = obj.material.emissive.getHex();
          obj.material.emissive.setHex(0xffff00);
          
          // reset previous
          if (self.clickedObjectId != null) {

            const exist = scene.getObjectById(self.clickedObjectId, true);

            exist.material.emissive.setHex(exist.currentHex);
          }

          self.clickedObjectId = obj.id;
        }

        if (objectSelection === 0) {

          intersects[0].object.material.transparent = true;
          if (intersects[0].object.material.opacity < 1) {

            intersects[0].object.material.opacity = 1;
          }
          else {

            intersects[0].object.material.opacity = 0.3;
          }
        }
        else if (objectSelection === 1) {

          /* Object is selected, can be used to add notes etc. */
        }
      }
      else {

        self.props.callBack();
        
        // reset previous
        if (self.clickedObjectId != null) {

          const exist = scene.getObjectById(self.clickedObjectId, true);

          exist.material.emissive.setHex(exist.currentHex);
        }

        self.clickedObjectId = null;
      }
    }
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
