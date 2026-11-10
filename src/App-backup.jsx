
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sparkles, Float, OrbitControls } from '@react-three/drei'
import './App.css'

function Vel() {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.08
    }
  })

  return (
    <group ref={ref} position={[0, -0.1, 0.5]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 3.8, 12]} />
        <meshStandardMaterial color="#e9ae43" metalness={0.9} roughness={0.2} emissive="#9d4d08" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <coneGeometry args={[0.16, 0.8, 6]} />
        <meshStandardMaterial color="#ffe6a0" metalness={0.95} roughness={0.12} emissive="#ffae32" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#fff1a8" />
      </mesh>
      <pointLight position={[0, 2, 0.3]} color="#ffb52e" intensity={5} distance={5} />
    </group>
  )
}

function Warrior({ demon = false }) {
  const body = demon ? '#42151a' : '#c98b42'
  const armor = demon ? '#761c20' : '#dcae55'

  return (
    <group position={demon ? [3.2, -1.3, -1] : [-2.4, -1.3, 0]}>
      <mesh position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.38, 0.85, 8, 16]} />
        <meshStandardMaterial color={body} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.75, 0]}>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshStandardMaterial color={body} roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.18, 0]}>
        <coneGeometry args={[0.38, 0.65, 5]} />
        <meshStandardMaterial color={armor} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-0.48, 0.95, 0]}>
        <capsuleGeometry args={[0.13, 0.65, 6, 10]} />
        <meshStandardMaterial color={armor} metalness={0.5} />
      </mesh>
      <mesh position={[0.48, 0.95, 0]}>
        <capsuleGeometry args={[0.13, 0.65, 6, 10]} />
        <meshStandardMaterial color={armor} metalness={0.5} />
      </mesh>
      {demon && (
        <>
          {[-0.23, 0.23].map((x) => (
            <mesh key={x} position={[x, 2.05, 0]}>
              <coneGeometry args={[0.12, 0.55, 5]} />
              <meshStandardMaterial color="#d8a34c" />
            </mesh>
          ))}
          <pointLight position={[0, 1.8, 1]} color="#ff2400" intensity={2} distance={4} />
        </>
      )}
    </group>
  )
}

function Mountains() {
  return (
    <group position={[0, -2, -5]}>
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={i} position={[(i - 5) * 2.2, -0.2, -Math.abs(i - 5) * 0.4]}>
          <coneGeometry args={[1.8, 4 + (i % 3), 5]} />
          <meshStandardMaterial color={i % 2 ? '#151b30' : '#20243b'} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function Scene() {
  const light = useRef()

  useFrame((state) => {
    if (light.current) {
      light.current.intensity = 2.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.8
    }
  })

  return (
    <>
      <color attach="background" args={['#050713']} />
      <fog attach="fog" args={['#080c1d', 8, 22]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 6, 4]} intensity={2} color="#ffd18a" />
      <pointLight ref={light} position={[0, 2, 2]} color="#ff9b35" distance={12} />
      <Stars radius={90} depth={55} count={3000} factor={4} fade speed={0.5} />
      <Sparkles count={140} scale={[13, 8, 8]} size={2} speed={0.4} color="#ffbd64" />
      <Mountains />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#090e1b" roughness={1} />
      </mesh>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <Vel />
      </Float>
      <Warrior />
      <Warrior demon />
      <pointLight position={[-3, 2, 1]} color="#ffb84e" intensity={3} distance={7} />
      <pointLight position={[3, 1, 1]} color="#a51d24" intensity={3} distance={7} />
      <OrbitControls enablePan={false} minDistance={7} maxDistance={12} />
    </>
  )
}

export default function App() {
  return (
    <main className="film">
      <Canvas camera={{ position: [0, 1, 10], fov: 48 }} dpr={[1, 1.5]}>
        <Scene />
      </Canvas>

      <div className="film-overlay">
        <div className="top-label">A DIVINE CINEMATIC EXPERIENCE</div>
        <div className="title-block">
          <p className="subtitle">THE LEGEND OF THE DIVINE WARRIOR</p>
          <h1>LORD MURUGAN</h1>
          <div className="gold-line" />
          <h2>VS NARAKASURAN</h2>
          <p className="description">
            When darkness rises, divine light awakens.
          </p>
          <span className="sacred">ॐ சரவணபவ</span>
        </div>
        <div className="bottom-label">A MYTHOLOGICAL CINEMATIC FILM · IN DEVELOPMENT</div>
      </div>
    </main>
  )
}
