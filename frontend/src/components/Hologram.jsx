
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial } from '@react-three/drei'

function Scene() {
  const sphereRef = useRef()
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (sphereRef.current) {
      sphereRef.current.rotation.x = Math.cos(t / 4) * 0.2
      sphereRef.current.rotation.y = Math.sin(t / 2) * 0.4
      sphereRef.current.position.y = Math.sin(t / 1.5) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[1, 64, 64]} ref={sphereRef}>
          <MeshDistortMaterial
            color="#00f5ff"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0}
            metalness={1}
            wireframe
            opacity={0.3}
            transparent
          />
        </Sphere>
        
        {/* Inner Core */}
        <Sphere args={[0.4, 32, 32]}>
          <MeshWobbleMaterial
            color="#0066ff"
            factor={0.6}
            speed={3}
            emissive="#00f5ff"
            emissiveIntensity={2}
          />
        </Sphere>
      </Float>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f5ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0066ff" />
    </group>
  )
}

export default function Hologram() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
