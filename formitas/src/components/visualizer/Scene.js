import React, { Component } from "react";
import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";

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
    scene.background = new THREE.Color(0x222222);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor(0xffffff, 1.0);

    // const dom = document.getElementById("three");
    // dom.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = true;
    controls.maxDistance = 1500;
    controls.minDistance = 0;

    const geometry = new THREE.SphereGeometry();
    const material = new THREE.MeshNormalMaterial({
      color: 0xff0000
    });

    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    const light_p = new THREE.PointLight(0xffffff);
    light_p.position.set(10, 10, 10);
    scene.add(light_p);

    // const light_a = new THREE.AmbientLight(0x333333);
    // scene.add(light_a);
    const animate = () => {
      requestAnimationFrame(animate);
      // const zoom = controls.object.position.distanceTo(controls.target);
      renderer.render(scene, camera);
    };
    this.container.appendChild(renderer.domElement);

    animate();

    this.globe = globe;
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
