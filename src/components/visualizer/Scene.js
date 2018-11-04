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
    loader.load('models/DamagedHelmet/glTF/DamagedHelmet.gltf', function (gltf) {

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
