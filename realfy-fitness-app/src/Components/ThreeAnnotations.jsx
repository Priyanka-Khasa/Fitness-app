import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ThreeAnnotations = ({ width, height, joint = [0, 0, 0], message = "Fix Form" }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

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
        textMesh.position.set(joint[0], joint[1] + 0.1, joint[2]);
        scene.add(textMesh);

        const dir = new THREE.Vector3(0, 0.1, 0);
        const origin = new THREE.Vector3(...joint);
        const arrowHelper = new THREE.ArrowHelper(dir.normalize(), origin, 0.08, 0xff0000);
        scene.add(arrowHelper);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [width, height, joint, message]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 20,
        width,
        height,
        pointerEvents: "none",
      }}
    />
  );
};

export default ThreeAnnotations;
