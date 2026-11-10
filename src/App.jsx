
import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

function CinematicScene({ progress }) {
  const [introTexture, battleTexture, victoryTexture] = useTexture([
    '/murugan-scene.png',
    '/murugan-battle.png',
    '/murugan-scene.png',
  ])

  const introMaterial = useRef()
  const battleMaterial = useRef()
  const victoryMaterial = useRef()

  useEffect(() => {
    ;[introTexture, battleTexture, victoryTexture].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 8
      texture.needsUpdate = true
    })
  }, [introTexture, battleTexture, victoryTexture])

  useFrame(({ camera, clock }) => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1)
    const time = clock.elapsedTime

    const faceOff = 1 - THREE.MathUtils.smoothstep(p, 0.25, 0.42)
    const battle =
      THREE.MathUtils.smoothstep(p, 0.32, 0.46) *
      (1 - THREE.MathUtils.smoothstep(p, 0.68, 0.80))
    const victory = THREE.MathUtils.smoothstep(p, 0.70, 0.88)

    if (introMaterial.current) {
      introMaterial.current.opacity = faceOff
    }

    if (battleMaterial.current) {
      battleMaterial.current.opacity = battle
    }

    if (victoryMaterial.current) {
      victoryMaterial.current.opacity = victory
    }

    const cameraX = THREE.MathUtils.lerp(-0.8, 0.8, p)
    const cameraZ = THREE.MathUtils.lerp(10, 7.2, p)

    const shake =
      battle > 0.2
        ? Math.sin(time * 19) * 0.045 * battle
        : 0

    camera.position.lerp(
      new THREE.Vector3(
        cameraX + shake,
        Math.sin(time * 0.3) * 0.035,
        cameraZ
      ),
      0.045
    )

    camera.lookAt(cameraX * 0.12, 0, 0)
  })

  return (
    <>
      <color attach="background" args={['#090604']} />
      <ambientLight intensity={0.8} />

      <pointLight
        position={[0, 3, 5]}
        color="#ffb45e"
        intensity={2.5}
      />

      {/* Scene 1: Face-off */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[16, 9]} />
        <meshBasicMaterial
          ref={introMaterial}
          map={introTexture}
          transparent
          opacity={1}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* Scene 2: Vel battle */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[16, 9]} />
        <meshBasicMaterial
          ref={battleMaterial}
          map={battleTexture}
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* Scene 3: Divine victory */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[16, 9]} />
        <meshBasicMaterial
          ref={victoryMaterial}
          map={victoryTexture}
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      <Sparkles
        count={180}
        scale={[16, 9, 4]}
        size={2.2}
        speed={0.35}
        opacity={0.7}
        color="#ffb65c"
      />

      <Sparkles
        count={65}
        scale={[14, 8, 3]}
        size={4}
        speed={0.18}
        opacity={0.4}
        color="#fff0c2"
      />
    </>
  )
}

const chapters = [
  {
    number: 'CHAPTER I',
    title: 'THE RISE OF DARKNESS',
    subtitle:
      'A kingdom falls under the shadow of Narakasuran. Fear spreads across the land.',
  },
  {
    number: 'CHAPTER II',
    title: 'THE DIVINE ARRIVAL',
    subtitle:
      'When darkness grows beyond all limits, a divine warrior rises with the sacred Vel.',
  },
  {
    number: 'CHAPTER III',
    title: 'THE CONFRONTATION',
    subtitle:
      'Two powerful forces stand face to face. The fate of the kingdom hangs in balance.',
  },
  {
    number: 'CHAPTER IV',
    title: 'THE POWER OF THE VEL',
    subtitle:
      'The sacred Vel shines with divine power as the final battle begins.',
  },
  {
    number: 'CHAPTER V',
    title: 'THE TRIUMPH OF LIGHT',
    subtitle:
      'Darkness gives way to divine light. Courage and righteousness prevail.',
  },
]

export default function App() {
  const progress = useRef(0)

  useEffect(() => {
    const updateScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight

      progress.current =
        maxScroll > 0 ? window.scrollY / maxScroll : 0
    }

    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScroll)
    }
  }, [])

  return (
    <main className="film">
      <div className="cinematic-background">
        <Canvas
          camera={{
            position: [0, 0, 10],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: false }}
        >
          <CinematicScene progress={progress} />
        </Canvas>

        <div className="cinematic-vignette" />
      </div>

      <div className="film-story">
        <section className="chapter opening">
          <p className="chapter-label">A DIVINE LEGEND</p>
          <h1>THE LEGEND OF MURUGAN</h1>
          <p className="opening-subtitle">
            THE BATTLE BETWEEN LIGHT AND DARKNESS
          </p>
          <span className="scroll-indicator">SCROLL TO BEGIN ↓</span>
        </section>

        {chapters.map((chapter) => (
          <section className="chapter" key={chapter.number}>
            <div className="chapter-content">
              <p className="chapter-label">{chapter.number}</p>
              <h2>{chapter.title}</h2>
              <p>{chapter.subtitle}</p>
            </div>
          </section>
        ))}

        <section className="chapter ending">
          <p className="chapter-label">THE END</p>
          <h2>VICTORY OF DIVINE LIGHT</h2>
          <p>OM SARAVANA BHAVA</p>
          <button
            className="replay-button"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          >
            REPLAY THE LEGEND
          </button>
        </section>
      </div>
    </main>
  )
}
