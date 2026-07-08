'use client'

import { Suspense, useRef, useEffect, RefObject } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as THREE from 'three'

type DropProps = {
  url: string
  position: [number, number, number]
  scale?: number
  rotationSpeed?: number
  color?: string
}

function Drop({ url, position, scale = 1, rotationSpeed = 0.3, color = '#5eb8f5' }: DropProps) {
  const ref = useRef<THREE.Group>(null)
  const obj = useLoader(OBJLoader, url)

  const cloned = obj.clone()
  cloned.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      mesh.material = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.85,
        thickness: 0.5,
        ior: 1.4,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
      })
    }
  })

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed
      ref.current.rotation.x += delta * rotationSpeed * 0.3
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={1.2} floatingRange={[-0.3, 0.3]}>
      <group ref={ref} position={position} scale={scale}>
        <primitive object={cloned} />
      </group>
    </Float>
  )
}

type FloatingDropsProps = {
  // When provided, drops fade in/out matching this element's opacity
  headerRef?: RefObject<HTMLDivElement | null>
}

export default function FloatingDrops({ headerRef }: FloatingDropsProps) {
  const wrapRef = useRef<HTMLDivElement>(null)

  // Sync drops opacity with the testimonials header opacity (set by ScrollTrigger)
  useEffect(() => {
    if (!headerRef?.current || !wrapRef.current) return
    let rafId: number
    const tick = () => {
      if (headerRef.current && wrapRef.current) {
        const op = parseFloat(headerRef.current.style.opacity || '0')
        wrapRef.current.style.opacity = String(op)
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [headerRef])

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[15]"
      style={{
        opacity: headerRef ? 0 : 1,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#60a5fa" />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#5eb8f5" />

        <Suspense fallback={null}>
          <Environment preset="city" />

          {/* Drop 1 — top-left, larger, slower */}
          <Drop
            url="/models/drop1.obj"
            position={[-3.5, 1.8, 0]}
            scale={0.9}
            rotationSpeed={0.25}
            color="#7cc4f7"
          />

          {/* Drop 2 — bottom-right, smaller, faster */}
          <Drop
            url="/models/drop2.obj"
            position={[3.2, -1.4, -0.5]}
            scale={0.7}
            rotationSpeed={0.4}
            color="#5eb8f5"
          />
        </Suspense>
      </Canvas>
    </div>
  )
}