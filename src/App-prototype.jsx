
import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

// --------------------------------------------------
// MATERIAL COLOURS
// --------------------------------------------------

const GOLD = '#e8b84f'
const DARK_GOLD = '#90601f'
const DIVINE_SKIN = '#a96f48'
const DEMON_SKIN = '#57232b'
const DARK_ARMOUR = '#451c29'
const TEAL = '#087d7c'

// --------------------------------------------------
// REUSABLE ORNAMENTS
// --------------------------------------------------

function GoldRing({ position, radius = 0.35, tube = 0.035 }) {
  return (
    <mesh
      position={position}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <torusGeometry args={[radius, tube, 8, 32]} />
      <meshStandardMaterial
        color={GOLD}
        metalness={0.9}
        roughness={0.22}
      />
    </mesh>
  )
}

function GoldBead({ position, size = 0.07 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 12, 10]} />
      <meshStandardMaterial
        color="#ffdb81"
        metalness={0.85}
        roughness={0.2}
      />
    </mesh>
  )
}

function Pendant() {
  return (
    <group position={[0, 1.43, 0.48]}>
      <mesh>
        <sphereGeometry args={[0.15, 16, 12]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <coneGeometry args={[0.12, 0.23, 6]} />
        <meshStandardMaterial color={DARK_GOLD} metalness={0.8} />
      </mesh>
    </group>
  )
}

// --------------------------------------------------
// CHARACTER FACE
// --------------------------------------------------

function CharacterFace({ demon = false }) {
  const skin = demon ? DEMON_SKIN : DIVINE_SKIN

  return (
    <group position={[0, 2.48, 0]}>
      {/* Face */}
      <mesh>
        <sphereGeometry args={[0.34, 24, 20]} />
        <meshStandardMaterial color={skin} roughness={0.78} />
      </mesh>

      {/* Ears */}
      {[-1, 1].map(side => (
        <mesh key={side} position={[side * 0.34, -0.02, 0]}>
          <sphereGeometry args={[0.12, 12, 10]} />
          <meshStandardMaterial color={skin} />
        </mesh>
      ))}

      {/* Eyes */}
      {[-1, 1].map(side => (
        <group key={side} position={[side * 0.13, 0.045, 0.285]}>
          <mesh>
            <sphereGeometry args={[0.067, 16, 12]} />
            <meshStandardMaterial color="#fff0d5" />
          </mesh>
          <mesh position={[0, 0, 0.055]}>
            <sphereGeometry args={[0.033, 12, 10]} />
            <meshBasicMaterial color={demon ? '#ff260e' : '#17100b'} />
          </mesh>
        </group>
      ))}

      {/* Nose */}
      <mesh position={[0, -0.045, 0.31]}>
        <sphereGeometry args={[0.075, 12, 10]} />
        <meshStandardMaterial color={skin} />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, -0.17, 0.29]} scale={[0.17, 0.045, 0.035]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial color={demon ? '#140506' : '#51201a'} />
      </mesh>

      {/* Demon fangs */}
      {demon && [-1, 1].map(side => (
        <mesh
          key={side}
          position={[side * 0.11, -0.19, 0.33]}
          rotation={[0, 0, Math.PI]}
        >
          <coneGeometry args={[0.045, 0.16, 8]} />
          <meshStandardMaterial color="#fff2d5" />
        </mesh>
      ))}

      {/* Divine forehead mark */}
      {!demon && (
        <group position={[0, 0.19, 0.34]}>
          <mesh>
            <boxGeometry args={[0.035, 0.18, 0.018]} />
            <meshStandardMaterial color="#f5e9cf" />
          </mesh>
          <mesh position={[0, 0, 0.014]}>
            <boxGeometry args={[0.025, 0.07, 0.02]} />
            <meshStandardMaterial color="#c82721" />
          </mesh>
        </group>
      )}

      {/* Demon moustache */}
      {demon && [-1, 1].map(side => (
        <mesh
          key={side}
          position={[side * 0.105, -0.11, 0.33]}
          rotation={[0, 0, side * -0.22]}
          scale={[0.16, 0.055, 0.05]}
        >
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color="#160b0b" />
        </mesh>
      ))}
    </group>
  )
}

// --------------------------------------------------
// CROWN AND HEAD ORNAMENTS
// --------------------------------------------------

function DivineCrown() {
  return (
    <group position={[0, 2.82, 0]}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.22, 12]} />
        <meshStandardMaterial color={DARK_GOLD} metalness={0.85} />
      </mesh>

      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.12, 0.3, 0.52, 10]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={0.88}
          roughness={0.22}
        />
      </mesh>

      <mesh position={[0, 0.82, 0]}>
        <coneGeometry args={[0.16, 0.42, 8]} />
        <meshStandardMaterial color="#ffe19a" metalness={0.8} />
      </mesh>

      <GoldBead position={[0, 1.07, 0]} size={0.09} />

      {[-1, 1].map(side => (
        <mesh
          key={side}
          position={[side * 0.29, 0.23, 0]}
          rotation={[0, 0, side * 0.35]}
        >
          <coneGeometry args={[0.08, 0.32, 6]} />
          <meshStandardMaterial color={GOLD} metalness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

function DemonCrown() {
  return (
    <group position={[0, 2.84, 0]}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.29, 0.4, 0.32, 10]} />
        <meshStandardMaterial color="#861e24" metalness={0.6} />
      </mesh>

      <mesh position={[0, 0.56, 0]}>
        <coneGeometry args={[0.33, 0.6, 8]} />
        <meshStandardMaterial
          color="#af3024"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {[-1, 1].map(side => (
        <mesh
          key={side}
          position={[side * 0.32, 0.65, 0]}
          rotation={[0, 0, side * -0.4]}
        >
          <coneGeometry args={[0.12, 0.65, 7]} />
          <meshStandardMaterial color="#241116" />
        </mesh>
      ))}

      <GoldBead position={[0, 0.93, 0]} size={0.1} />
    </group>
  )
}

// --------------------------------------------------
// SHOULDER AND ARMOUR DETAILS
// --------------------------------------------------

function ShoulderArmour({ side, demon }) {
  return (
    <group position={[side * 0.47, 2.0, 0]}>
      <mesh scale={[1, 0.72, 0.72]}>
        <sphereGeometry args={[0.32, 16, 12]} />
        <meshStandardMaterial
          color={demon ? '#702b35' : GOLD}
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>

      <GoldRing
        position={[0, -0.1, 0.02]}
        radius={0.23}
        tube={0.035}
      />
    </group>
  )
}

function Arm({ side, demon, armRef }) {
  const skin = demon ? DEMON_SKIN : DIVINE_SKIN

  return (
    <group ref={armRef} position={[side * 0.52, 1.73, 0]}>
      {/* Upper arm */}
      <mesh
        position={[side * 0.02, -0.27, 0]}
        rotation={[0, 0, side * -0.17]}
      >
        <cylinderGeometry args={[0.14, 0.19, 0.63, 12]} />
        <meshStandardMaterial color={skin} />
      </mesh>

      {/* Forearm */}
      <mesh position={[side * 0.13, -0.76, 0.02]}>
        <cylinderGeometry args={[0.11, 0.14, 0.52, 12]} />
        <meshStandardMaterial color={skin} />
      </mesh>

      {/* Wrist ornament */}
      <GoldRing
        position={[side * 0.13, -0.94, 0.02]}
        radius={0.13}
        tube={0.045}
      />

      {/* Hand */}
      <mesh position={[side * 0.13, -1.08, 0.04]}>
        <sphereGeometry args={[0.14, 12, 10]} />
        <meshStandardMaterial color={skin} />
      </mesh>
    </group>
  )
}

// --------------------------------------------------
// COMPLETE WARRIOR MODEL
// --------------------------------------------------

function Warrior({
  position,
  demon = false,
  scale = 1,
  rotation = [0, 0, 0]
}) {
  const group = useRef()
  const leftArm = useRef()
  const rightArm = useRef()

  const skin = demon ? DEMON_SKIN : DIVINE_SKIN

  useFrame(({ clock }) => {
    const time = clock.elapsedTime

    if (group.current) {
      group.current.position.y =
        position[1] + Math.sin(time * 1.25) * 0.025
    }

    if (leftArm.current) {
      leftArm.current.rotation.z = -0.08 + Math.sin(time * 1.5) * 0.025
    }

    if (rightArm.current) {
      rightArm.current.rotation.z = 0.08 + Math.sin(time * 1.5 + 1) * 0.025
    }
  })

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {/* Back halo */}
      {!demon && (
        <mesh position={[0, 2.7, -0.42]}>
          <torusGeometry args={[0.95, 0.035, 8, 48]} />
          <meshStandardMaterial
            color="#f5c66b"
            emissive="#b96b20"
            emissiveIntensity={1.5}
            metalness={0.8}
          />
        </mesh>
      )}

      {/* Legs */}
      {[-1, 1].map(side => (
        <group key={side} position={[side * 0.22, 0.31, 0]}>
          <mesh>
            <cylinderGeometry args={[0.16, 0.2, 0.72, 12]} />
            <meshStandardMaterial color={skin} />
          </mesh>
          <GoldRing position={[0, 0.18, 0]} radius={0.17} />
          <mesh position={[0, -0.35, 0.15]} scale={[1, 0.42, 1.5]}>
            <sphereGeometry args={[0.17, 12, 10]} />
            <meshStandardMaterial color={skin} />
          </mesh>
          <GoldRing
            position={[0, 0.0, 0]}
            radius={0.18}
            tube={0.04}
          />
        </group>
      ))}

      {/* Dhoti */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.36, 0.59, 0.83, 16]} />
        <meshStandardMaterial
          color={demon ? '#701f28' : '#d4a64c'}
          roughness={0.65}
        />
      </mesh>

      {/* Dhoti front cloth */}
      <mesh position={[0, 0.75, 0.37]}>
        <boxGeometry args={[0.37, 0.8, 0.07]} />
        <meshStandardMaterial color={demon ? '#a52c2c' : '#f3d18c'} />
      </mesh>

      {/* Waist belt */}
      <mesh position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.16, 16]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Belt jewel */}
      <GoldBead position={[0, 1.22, 0.42]} size={0.12} />

      {/* Torso */}
      <mesh position={[0, 1.68, 0]}>
        <cylinderGeometry args={[0.31, 0.48, 1.12, 16]} />
        <meshStandardMaterial
          color={skin}
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* Chest armour */}
      <mesh position={[0, 1.77, 0.31]}>
        <boxGeometry args={[0.85, 0.55, 0.14]} />
        <meshStandardMaterial
          color={demon ? '#692631' : '#a57632'}
          metalness={0.8}
          roughness={0.28}
        />
      </mesh>

      {/* Chest ornaments */}
      <GoldRing position={[0, 1.96, 0.35]} radius={0.39} tube={0.035} />
      <GoldRing position={[0, 1.77, 0.37]} radius={0.32} tube={0.026} />
      <Pendant />

      {/* Shoulder armour */}
      <ShoulderArmour side={-1} demon={demon} />
      <ShoulderArmour side={1} demon={demon} />

      {/* Arms */}
      <Arm side={-1} demon={demon} armRef={leftArm} />
      <Arm side={1} demon={demon} armRef={rightArm} />

      {/* Upper arm bands */}
      {[-1, 1].map(side => (
        <GoldRing
          key={side}
          position={[side * 0.65, 1.42, 0]}
          radius={0.16}
          tube={0.04}
        />
      ))}

      {/* Neck */}
      <mesh position={[0, 2.31, 0]}>
        <cylinderGeometry args={[0.16, 0.19, 0.3, 12]} />
        <meshStandardMaterial color={skin} />
      </mesh>

      {/* Neck jewellery */}
      <GoldRing position={[0, 2.21, 0]} radius={0.22} tube={0.055} />
      <GoldRing position={[0, 2.1, 0]} radius={0.27} tube={0.035} />

      {/* Head and face */}
      <CharacterFace demon={demon} />

      {/* Crown */}
      {demon ? <DemonCrown /> : <DivineCrown />}

      {/* Demon extra shoulder spikes */}
      {demon && [-1, 1].map(side => (
        <mesh
          key={side}
          position={[side * 0.65, 2.17, 0]}
          rotation={[0, 0, side * -0.8]}
        >
          <coneGeometry args={[0.13, 0.65, 6]} />
          <meshStandardMaterial color="#8b3032" />
        </mesh>
      ))}
    </group>
  )
}

// --------------------------------------------------
// LORD MURUGAN'S VEL
// --------------------------------------------------

const velShape = new THREE.Shape()

velShape.moveTo(0, 1.2)
velShape.quadraticCurveTo(-0.09, 0.7, -0.43, 0.08)
velShape.quadraticCurveTo(-0.2, -0.12, 0, -0.22)
velShape.quadraticCurveTo(0.2, -0.12, 0.43, 0.08)
velShape.quadraticCurveTo(0.09, 0.7, 0, 1.2)
velShape.closePath()

function DivineVel({ position }) {
  const glow = useRef()

  useFrame(({ clock }) => {
    if (glow.current) {
      glow.current.intensity = 2.5 + Math.sin(clock.elapsedTime * 2) * 0.7
    }
  })

  return (
    <group position={position}>
      {/* Golden shaft */}
      <mesh position={[0, 2.02, 0]}>
        <cylinderGeometry args={[0.055, 0.09, 3.8, 16]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={1}
          roughness={0.16}
          emissive="#68400c"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Vel blade */}
      <mesh position={[0, 3.82, 0]}>
        <extrudeGeometry
          args={[
            velShape,
            {
              depth: 0.09,
              bevelEnabled: true,
              bevelSegments: 3,
              bevelSize: 0.035,
              bevelThickness: 0.035
            }
          ]}
        />
        <meshStandardMaterial
          color="#ffda77"
          metalness={0.95}
          roughness={0.13}
          emissive="#b86d13"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Blade centre line */}
      <mesh position={[0, 4.25, 0.11]}>
        <boxGeometry args={[0.025, 0.68, 0.025]} />
        <meshStandardMaterial
          color="#fff0bc"
          emissive="#ffca6c"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Cross guard */}
      <mesh position={[0, 3.7, 0]}>
        <sphereGeometry args={[0.15, 16, 12]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} />
      </mesh>

      {/* Shaft decorations */}
      {[0.5, 0.75, 1.0, 2.7, 2.95].map(y => (
        <GoldRing
          key={y}
          position={[0, y, 0]}
          radius={0.1}
          tube={0.025}
        />
      ))}

      {/* Glowing aura */}
      <mesh ref={glow} position={[0, 3.8, -0.3]}>
        <torusGeometry args={[0.75, 0.025, 8, 48]} />
        <meshBasicMaterial
          color="#ffc66a"
          transparent
          opacity={0.65}
        />
      </mesh>

      <pointLight
        ref={glow}
        position={[0, 3.5, 1]}
        color="#ffbd56"
        intensity={2.5}
        distance={12}
      />
    </group>
  )
}

// --------------------------------------------------
// PEACOCK – MURUGAN'S VAHANAM
// --------------------------------------------------

function Peacock({ position }) {
  return (
    <group position={position} scale={1.15}>
      {/* Tail fan */}
      <group position={[0, 0.85, -0.45]}>
        {Array.from({ length: 9 }, (_, index) => {
          const angle = (index - 4) * 0.2

          return (
            <group key={index}>
              {/* Feather */}
              <mesh
                position={[
                  Math.sin(angle) * 0.7,
                  Math.cos(angle) * 0.45,
                  0
                ]}
                rotation={[0, 0, -angle]}
                scale={[0.12, 0.8, 0.06]}
              >
                <sphereGeometry args={[1, 12, 10]} />
                <meshStandardMaterial color="#087f72" roughness={0.45} />
              </mesh>

              {/* Feather eye */}
              <mesh
                position={[
                  Math.sin(angle) * 0.7,
                  1.05 + Math.cos(angle) * 0.45,
                  0.07
                ]}
              >
                <sphereGeometry args={[0.13, 12, 10]} />
                <meshStandardMaterial color="#d4a849" />
              </mesh>
              <mesh
                position={[
                  Math.sin(angle) * 0.7,
                  1.05 + Math.cos(angle) * 0.45,
                  0.16
                ]}
              >
                <sphereGeometry args={[0.075, 12, 10]} />
                <meshStandardMaterial color="#064f77" />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Body */}
      <mesh position={[0, 0.75, 0]} scale={[0.7, 0.38, 0.42]}>
        <sphereGeometry args={[1, 20, 16]} />
        <meshStandardMaterial color={TEAL} roughness={0.45} />
      </mesh>

      {/* Neck */}
      <mesh
        position={[0.3, 1.18, 0.05]}
        rotation={[0, 0, -0.18]}
      >
        <cylinderGeometry args={[0.1, 0.17, 0.85, 12]} />
        <meshStandardMaterial color="#087d8b" />
      </mesh>

      {/* Head */}
      <mesh position={[0.34, 1.65, 0.05]}>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshStandardMaterial color="#0b8692" />
      </mesh>

      {/* Beak */}
      <mesh
        position={[0.34, 1.59, 0.25]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <coneGeometry args={[0.07, 0.25, 8]} />
        <meshStandardMaterial color="#d8a441" />
      </mesh>

      {/* Eye */}
      <mesh position={[0.43, 1.68, 0.21]}>
        <sphereGeometry args={[0.035, 10, 8]} />
        <meshBasicMaterial color="#080b12" />
      </mesh>

      {/* Crest */}
      {[-1, 0, 1].map(side => (
        <mesh
          key={side}
          position={[0.34 + side * 0.08, 1.91, 0.02]}
          rotation={[0, 0, side * -0.2]}
        >
          <coneGeometry args={[0.055, 0.35, 6]} />
          <meshStandardMaterial color={GOLD} />
        </mesh>
      ))}

      {/* Legs */}
      {[-1, 1].map(side => (
        <mesh
          key={side}
          position={[side * 0.27, 0.2, 0]}
        >
          <cylinderGeometry args={[0.045, 0.045, 0.5, 8]} />
          <meshStandardMaterial color="#b68c42" />
        </mesh>
      ))}
    </group>
  )
}

// --------------------------------------------------
// ENVIRONMENT AND MOUNTAINS
// --------------------------------------------------

function Mountain({ position, scale, color }) {
  return (
    <mesh position={position} scale={scale}>
      <coneGeometry args={[1, 1, 8]} />
      <meshStandardMaterial
        color={color}
        roughness={1}
        flatShading
      />
    </mesh>
  )
}

function MountainRange() {
  return (
    <group>
      {Array.from({ length: 12 }, (_, index) => {
        const z = -index * 11 - 5

        return (
          <group key={index}>
            <Mountain
              position={[-13, 3, z]}
              scale={[9, 17, 7]}
              color="#131b2a"
            />
            <Mountain
              position={[13, 4, z - 4]}
              scale={[10, 18, 7]}
              color="#1a1e2d"
            />
            <Mountain
              position={[0, 3, z - 9]}
              scale={[12, 18, 7]}
              color="#202333"
            />
          </group>
        )
      })}
    </group>
  )
}

function BattlefieldGround() {
  return (
    <group>
      <mesh
        position={[0, -0.8, -65]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[85, 170]} />
        <meshStandardMaterial
          color="#10121a"
          roughness={1}
        />
      </mesh>

      {Array.from({ length: 45 }, (_, index) => {
        const x = Math.sin(index * 12.7) * 17
        const z = -index * 3.2 - 4
        const size = 0.3 + (index % 4) * 0.18

        return (
          <mesh
            key={index}
            position={[x, -0.45, z]}
            scale={size}
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={index % 2 ? '#2d2730' : '#1b202c'}
              roughness={1}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function Moon({ position, color, size }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 32, 24]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// --------------------------------------------------
// CINEMATIC SCENE
// --------------------------------------------------

function Scene({ progress }) {
  const target = useRef(new THREE.Vector3())
  const destination = useRef(new THREE.Vector3())

  useFrame(({ camera, clock }) => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1)
    const time = clock.elapsedTime

    // Scroll-driven camera movement
    destination.current.set(
      Math.sin(p * Math.PI * 4) * 0.35,
      3.2 + Math.sin(time * 0.35) * 0.04,
      12 - p * 135
    )

    target.current.set(
      0,
      1.7,
      6 - p * 135
    )

    camera.position.lerp(destination.current, 0.075)
    camera.lookAt(target.current)
  })

  return (
    <>
      {/* Sky */}
      <color attach="background" args={['#050711']} />
      <fog attach="fog" args={['#080b16', 32, 150]} />

      {/* Main illumination */}
      <ambientLight intensity={0.65} />

      <directionalLight
        position={[-8, 16, 8]}
        intensity={2}
        color="#b7c9e8"
      />

      {/* Distant stars */}
      <Stars
        radius={100}
        depth={80}
        count={1000}
        factor={2}
        fade
        speed={0.15}
      />

      {/* Floating fire particles */}
      <Sparkles
        count={110}
        scale={[25, 12, 130]}
        position={[0, 3, -60]}
        size={1.5}
        speed={0.18}
        color="#e9a84c"
      />

      <BattlefieldGround />
      <MountainRange />

      {/* Scene 1 – Dark sky */}
      <Moon
        position={[0, 9, -14]}
        color="#96252b"
        size={3.4}
      />

      <pointLight
        position={[0, 3, -15]}
        color="#9d1b25"
        intensity={75}
        distance={35}
      />

      {/* Scene 2 – Narakasuran awakening */}
      <Warrior
        position={[0, -0.8, -27]}
        demon
        scale={1.55}
      />

      <pointLight
        position={[0, 4, -27]}
        color="#d52e1f"
        intensity={100}
        distance={25}
      />

      {/* Scene 3 – Lord Murugan's arrival */}
      <Moon
        position={[0, 9, -48]}
        color="#dba755"
        size={2.5}
      />

      <Warrior
        position={[0, -0.8, -49]}
        scale={1.35}
      />

      <Peacock position={[-1.8, -0.8, -50]} />

      <pointLight
        position={[0, 5, -49]}
        color="#ffca73"
        intensity={100}
        distance={25}
      />

      {/* Scene 4 – Divine Vel close-up */}
      <DivineVel position={[1.5, -0.8, -68]} />

      <pointLight
        position={[1.5, 3.5, -68]}
        color="#ffb747"
        intensity={125}
        distance={24}
      />

      {/* Scene 5 – Final confrontation */}
      <Warrior
        position={[-2.4, -0.8, -93]}
        rotation={[0, -0.4, 0]}
        scale={1.4}
      />

      <Warrior
        position={[2.4, -0.8, -93]}
        rotation={[0, 0.4, 0]}
        demon
        scale={1.6}
      />

      <pointLight
        position={[-2, 4, -93]}
        color="#ffc36b"
        intensity={90}
        distance={24}
      />

      <pointLight
        position={[2, 4, -93]}
        color="#c52724"
        intensity={90}
        distance={24}
      />

      {/* Scene 6 – Divine victory */}
      <Moon
        position={[0, 10, -123]}
        color="#ffcf7a"
        size={4}
      />

      <Warrior
        position={[0, -0.8, -122]}
        scale={1.6}
      />

      <pointLight
        position={[0, 5, -121]}
        color="#ffc86b"
        intensity={180}
        distance={40}
      />
    </>
  )
}

// --------------------------------------------------
// MAIN APPLICATION
// --------------------------------------------------

export default function App() {
  const progress = useRef(0)

  useEffect(() => {
    const updateScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight

      progress.current =
        maxScroll > 0
          ? window.scrollY / maxScroll
          : 0
    }

    updateScroll()

    window.addEventListener('scroll', updateScroll, {
      passive: true
    })

    return () => {
      window.removeEventListener('scroll', updateScroll)
    }
  }, [])

  return (
    <main className="film">
      <Canvas
        camera={{
          position: [0, 3.2, 12],
          fov: 42,
          near: 0.1,
          far: 200
        }}
        dpr={1}
        gl={{
          antialias: false,
          powerPreference: 'low-power'
        }}
      >
        <Scene progress={progress} />
      </Canvas>
    </main>
  )
}
