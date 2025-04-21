import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ThreeAnnotations = ({ width, height, joint, message }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Text
    const loader = new THREE.FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        const geometry = new THREE.TextGeometry(message, {
          font,
          size: 0.05,
          height: 0.01,
        });

        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const textMesh = new THREE.Mesh(geometry, material);
        textMesh.position.set(-0.3, 0.3, 0);
        scene.add(textMesh);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [width, height, message]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 20,
        width: width,
        height: height,
        pointerEvents: "none",
      }}
    />
  );
};

export default ThreeAnnotations;
