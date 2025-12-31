// components/threejs/Avatar3D.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial } from '@react-three/drei';

function Avatar3D({ position, color, isSpeaking }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && isSpeaking) {
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshWobbleMaterial color={color} speed={1} factor={0.2} />
    </mesh>
  );
}
