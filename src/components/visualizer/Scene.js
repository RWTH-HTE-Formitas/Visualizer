import React, { Component } from "react";
import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";
import GLTFLoader from 'three-gltf-loader';

class Scene extends Component {
  render() {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh"
        }}
        ref={el => (this.container = el)}
      />
    );
  }

  componentDidMount() {

    // #region global variables

    var self = this;
    var scene, camera, renderer, controls, loader, projector, mouseVector, raycaster, modelRef, cameraRef;
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
      scene.background = new THREE.Color(0xffcc80);

      // camera
      camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      camera.position.z = 100;
      cameraRef = camera;

      // renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xffffff, 1.0);

      // controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enabled = true;
      controls.maxDistance = 1500;
      controls.minDistance = 0;
      controls.keys = {LEFT: 97, UP: 119, RIGHT: 100, BOTTOM: 115};

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

        modelRef = gltf.scene;
        scene.add(gltf.scene);
        
        var size = Math.max(box.getSize(point).x, box.getSize(point).y, box.getSize(point).z);
        var gridHelper = new THREE.GridHelper(size, size / 5);
        scene.add(gridHelper);

        var gridHelperY = new THREE.GridHelper(size, size / 5);
        gridHelperY.rotation.x = Math.PI / 2;
        scene.add(gridHelperY);

        camera.position.z = box.getSize(point).z * 1.5;
      });

      projector = new THREE.Projector();
      window.addEventListener('click', onMouseDown, false);
      window.addEventListener('keypress', onKeyPress, false);
      self.container.appendChild(renderer.domElement);

    }

    // #endregion

    // #region animate

    // rendering the scene
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    // #endregion

    // #region keyboard exploration

    // Manages keyboard events
    function onKeyPress(event) {
      var keyPressed = event.which;
      var delta = 5; 
      var theta = 0.01; // angle

      // euclidean distance from camera to object
      var cameraDistance = Math.sqrt((modelRef.position.x - camera.position.x) * (modelRef.position.x - camera.position.x) + 
        (modelRef.position.y - camera.position.y) * (modelRef.position.y - camera.position.y) + 
        (modelRef.position.z - camera.position.z) * (modelRef.position.z - camera.position.z)) + 
        1.0;

      switch (keyPressed) {
        case 116:// t: Toggle between object transparency and simple selection
          if (objectSelection === 1)
            objectSelection = 0;
          else
            objectSelection = 1;
          break;
        // move camera according to its distance to the model
        case 119: // w: move camera on y axis
          camera.position.y += (cameraDistance / 100) * delta;
          break;
        case 97: // a: move camera on x axis 
          camera.position.x -= (cameraDistance / 100) * delta;
          break;
        case 115: // s: move camera on y axis
          camera.position.y -= (cameraDistance / 100) * delta;
          break;
        case 100: // d: move camera on x axis
          camera.position.x += (cameraDistance / 100) * delta;
          break;
        case 121: // y: move camera on z axis
          camera.position.z -= (cameraDistance / 100) * delta;
          break;
        case 120: // x: move camera on z axis
          camera.position.z += (cameraDistance / 100) * delta;
          break;
        // rotate camera around axes
        case 106: // j: rotate camera to left
          camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), theta);
          break;
        case 108: // l: rotate camera to right
          camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), (-theta));
          break;
        case 105: // i: rotate camera up
          camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), theta);
          break;
        case 107: // k: rotate camera down
          camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), (-theta));
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
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5);
      projector.unprojectVector(mouseVector, camera);
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
