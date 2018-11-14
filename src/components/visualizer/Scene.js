import React, { Component } from "react";
import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";
import GLTFLoader from 'three-gltf-loader';
import VREffect from "three-vreffect-module";
import VRControls from "three-vrcontrols-module";
import * as webvrui from 'webvr-ui';

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
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffcc80);

    // camera
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 100;


    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1.0);
    //renderer.vr.enabled = true;

    var vrControls = new VRControls(camera);
    vrControls.standing = true;

    var vrEffect = new VREffect( renderer );
    vrEffect.setSize( window.innerWidth, window.innerHeight );
    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
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
    var loader = new GLTFLoader();
    loader.load(this.props.modelLocation, function (gltf) {

      var box = new THREE.Box3().setFromObject(gltf.scene.children[0]);

      gltf.scene.children[0].position.x = -1 * box.getCenter().x;
      gltf.scene.children[0].position.y = -1 * box.getCenter().y;
      gltf.scene.children[0].position.z = -1 * box.getCenter().z;
      
      scene.add(gltf.scene);

      var size = Math.max(box.getSize().x, box.getSize().y, box.getSize().z);
      var gridHelper = new THREE.GridHelper(size, size/5);
      scene.add(gridHelper);

      var gridHelperY = new THREE.GridHelper(size, size / 5);
      gridHelperY.rotation.x = Math.PI / 2;
      scene.add(gridHelperY);

      camera.position.z = box.getSize().z*1.5;
    });

    var projector = new THREE.Projector();
    window.addEventListener( 'mousedown', onMouseDown, false );
    window.addEventListener('keypress', onKeyPress, false);

    // Select mode: 0 = Transparency on, 1 = Object selection on/transparency off
    var objectSelection = 1;

  // Toggle modes via key press
  function onKeyPress(event){
    var keyPressed = event.which;
    var delta = 50; 
    var theta = 0.01;
    var zoom = 1.0;

    switch(keyPressed){
      case 116:// t: Toggle object transparency
        if (objectSelection === 1)
          objectSelection = 0;
        else
          objectSelection = 1;
        break;
      case 37: //left arrow: move camera
        camera.position.x = camera.position.x - delta;
        break;
      case 38: //up arrow: move camera
        camera.position.y = camera.position.y + delta;
        break;
      case 39: //right arrow: move camera
        camera.position.x = camera.position.x + delta;
        break;
      case 40: //down arrow: move camera
        camera.position.y = camera.position.y - delta;
        break;
      case 120: // x : zoom out
        camera.position.z = camera.position.z + zoom;
        break;
      case 121: // y : zoom in
        camera.position.z = camera.position.z - zoom;        
        break;
      case 115: // s : camera rotates down
        camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), (-theta));
        break;
      case 119: // w : camera rotates up
        camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), theta);
        break;
      case 97: //a: camera rotates to left
        camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), theta);
        break;
      case 100: //d: camera rotates to right
        camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), (-theta));
        break;

      default:
        break;
    }

  }

  // Either make objects transparent/opaque or select and color them on mouse click event depending on selected mode
  function onMouseDown(event){

    var mouseVector = new THREE.Vector3(
      ( event.clientX / window.innerWidth ) * 2 - 1, 
      -( event.clientY / window.innerHeight ) * 2 + 1, 
      0.5);
    projector.unprojectVector(mouseVector, camera);
    var raycaster = new THREE.Raycaster(camera.position, mouseVector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects( scene.children, true );

    if(objectSelection === 0){    
      if (intersects.length > 0) {
        intersects[0].object.material.transparent = true;
        if (intersects[0].object.material.opacity < 1) {
            intersects[0].object.material.opacity = 1;
        } else {
            intersects[0].object.material.opacity = 0.3;
        }
      }
    }

    else if(objectSelection === 1){
      /* Object is selected, can be used to add notes etc. */
  }
}

      
 // Adds button for VR component
  var options = {
    color: 'black',
    textEnterVRTitle: 'START VR MODE',
    textExitVRTitle: 'STOP VR MODE',
    textVRNotFoundTitle: 'NO VR HEADSET FOUND'
  };
  var enterVR = new webvrui.EnterVRButton(renderer.domElement, options);
  document.getElementById('vr-button').appendChild(enterVR.domElement);

    // animate
    const animate = () => {
      vrControls.update();
      //manager.render(scene, camera);
      requestAnimationFrame(animate);
      //renderer.render(scene, camera);
      vrEffect.render(scene, camera);  

    };
    this.container.appendChild(renderer.domElement);

    animate();

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
