import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Box, Plane, Sphere } from "@react-three/drei";

const OverlayModel = () => {
  return (
    <div className="w-full h-64 md:h-80 lg:h-[28rem] bg-white rounded-xl shadow-inner overflow-hidden">
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls enableZoom={false} />

        <group position={[0, 0, 0]}>
          <Sphere args={[0.3, 32, 32]} position={[0, 2.2, 0]}>
            <meshStandardMaterial color="#fbbf24" />
          </Sphere>
          <Box args={[0.6, 1.2, 0.3]} position={[0, 1.2, 0]}>
            <meshStandardMaterial color="#4ade80" />
          </Box>
          <Box args={[0.2, 1, 0.2]} position={[-0.4, 0.2, 0]}>
            <meshStandardMaterial color="#60a5fa" />
          </Box>
          <Box args={[0.2, 1, 0.2]} position={[0.4, 0.2, 0]}>
            <meshStandardMaterial color="#60a5fa" />
          </Box>
          <Box args={[0.2, 1, 0.2]} position={[-0.2, -1, 0]}>
            <meshStandardMaterial color="#f87171" />
          </Box>
          <Box args={[0.2, 1, 0.2]} position={[0.2, -1, 0]}>
            <meshStandardMaterial color="#f87171" />
          </Box>
        </group>

        <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <meshStandardMaterial color="#e5e7eb" />
        </Plane>
      </Canvas>
    </div>
  );
};

export default OverlayModel;
