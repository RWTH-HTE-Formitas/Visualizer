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
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1.0);

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
    //var rotation = 0.01;
    var zoom = 1.0;

    switch(keyPressed){
      case 122: // z: Object transparency off
        objectSelection = 1;
        break;
      case 116:// t: Object transparency on
        objectSelection = 0;
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
      case 115: // s : rotate down
        break;
      case 119: // w : rotate up
        break;
      case 97: //a: rotate left
        break;
      case 100: //d: rotate right
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
      /*if (intersects.length > 0) {
        intersects[0].object.material.transparent = true;
       if(intersects[0].object.material.opacity === 1){
          for ( var i = 0; i < intersects.length; i++ ) {
            intersects[i].object.material.color.setHex(0xffff00);
            intersects[0].object.material.opacity = 0.9;
          }
        }
        else {
          for ( var i = 0; i < intersects.length; i++ ) {
            intersects[i].object.material.color.setHex(0xffffff);
            intersects[0].object.material.opacity = 1;
          }
        }
      }*/


  }
}

      

    // animate
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
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
