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

  componentDidMount() {

    // #region global variables

    var self = this;
    var scene, camera, renderer, controls, loader, projector, mouseVector, raycaster;
    var objectSelection = 1; // Select mode: 0 = Transparency on, 1 = Object selection on/transparency off

    // #endregion

    // #region main 

    init();
    animate();

    // #endregion

    // #region init

    // initialize all objects here
    function init() {

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      // camera
      camera = new THREE.PerspectiveCamera(
        50,
        width/height,
        0.1,
        2000
      );
      camera.position.z = 100;

      // renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setClearColor(0xffffff, 1.0);
      renderer.domElement.addEventListener('click', onMouseDown, false);
      window.addEventListener('keypress', onKeyPress, false);

      // controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enabled = true;
      controls.maxDistance = 1500;
      controls.minDistance = 0;

      //light
      let light_p = new THREE.HemisphereLight(0xbbbbff, 0x444422);
      light_p.position.set(1000, 1000, 1000);
      scene.add(light_p);

      light_p = new THREE.HemisphereLight(0xbbbbff, 0x444422);
      light_p.position.set(-1000, 1000, -1000);
      scene.add(light_p);
      
      // model
      loader = new GLTFLoader();
      loader.load(self.props.modelLocation, function (gltf) {

        var box = new THREE.Box3().setFromObject(gltf.scene.children[0]);
        var point = new THREE.Vector3();

        gltf.scene.children[0].position.x = -1 * box.getCenter(point).x;
        gltf.scene.children[0].position.y = -1 * box.getCenter(point).y;
        gltf.scene.children[0].position.z = -1 * box.getCenter(point).z;

        scene.add(gltf.scene);

        camera.position.z = box.getSize(point).z * 1.5;
      });

      projector = new THREE.Projector();

      self.container.appendChild(renderer.domElement);

    }

    // #endregion

    // #region animate

    // rendering the scene
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    // #endregion

    // #region keyboard exploration

    // Toggle modes via key press
    function onKeyPress(event) {
      var keyPressed = event.which;
      var delta = 50;
      var theta = 0.01;
      var zoom = 1.0;

      switch (keyPressed) {
        case 116:// t
          // Toggle object transparency
          if (objectSelection === 1)
            objectSelection = 0;
          else
            objectSelection = 1;
          break;
        case 37: //left arrow
          camera.position.x = camera.position.x - delta; // move camera
          break;
        case 38: //up arrow
          camera.position.y = camera.position.y + delta; // move camera
          break;
        case 39: //right arrow
          camera.position.x = camera.position.x + delta; // move camera
          break;
        case 40: //down arrow
          camera.position.y = camera.position.y - delta; // move camera
          break;
        case 120: // x
          camera.position.z = camera.position.z + zoom; // move forward
          break;
        case 121: // y
          camera.position.z = camera.position.z - zoom; // move backward
          break;
        case 115: // s
          camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), (-theta)); // camera rotates down
          break;
        case 119: // w
          camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), theta); // camera rotates up
          break;
        case 97: // a
          camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), theta); // camera rotates to left
          break;
        case 100: // d
          camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), (-theta)); // camera rotates to right
          break;

        default:
          break;
      }

    }

    // #endregion

    // #region mouse down event

    // Either make objects transparent/opaque or select and color them on mouse click event depending on selected mode
    function onMouseDown(event) {
      mouseVector = new THREE.Vector3(
        (event.offsetX / width) * 2 - 1,
        -(event.offsetY / height) * 2 + 1,
        0.5);
      mouseVector.unproject(camera);
      raycaster = new THREE.Raycaster(camera.position, mouseVector.sub(camera.position).normalize());
      var intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {  
        self.props.callBack({
          id: intersects[0].object.id
        });
   
        if (objectSelection === 0) {
          intersects[0].object.material.transparent = true;
          if (intersects[0].object.material.opacity < 1) {
            intersects[0].object.material.opacity = 1;
          } else {
            intersects[0].object.material.opacity = 0.3;
          }
        } else if (objectSelection === 1) {
          /* Object is selected, can be used to add notes etc. */
        }
      }
    }

    // #endregion
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.color !== nextProps.color) {
      this.globe.material.color.setHex(nextProps.color);
    }
  }
}

export default Scene;
