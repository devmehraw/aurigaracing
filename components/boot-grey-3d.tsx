"use client"

import { useEffect, useRef, Suspense } from "react"
import * as THREE from "three"

function BootGrey3DScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    const textureLoader = new THREE.TextureLoader()
    const bootTexture = textureLoader.load("/images/boot-1.png")

    const geometry = new THREE.PlaneGeometry(4, 4)
    const material = new THREE.MeshStandardMaterial({
      map: bootTexture,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.3,
      metalness: 0.2,
    })

    const boot = new THREE.Mesh(geometry, material)
    scene.add(boot)

    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 100
    const positions = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xa8a8a8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const spotLight1 = new THREE.SpotLight(0xa8a8a8, 2)
    spotLight1.position.set(3, 3, 3)
    scene.add(spotLight1)

    const spotLight2 = new THREE.SpotLight(0x808080, 1.5)
    spotLight2.position.set(-3, -2, 2)
    scene.add(spotLight2)

    const spotLight3 = new THREE.SpotLight(0xffffff, 1.5)
    spotLight3.position.set(0, -3, -2)
    scene.add(spotLight3)

    camera.position.z = 6

    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01

      // Rotate the boot in 3D space (same as bootie)
      boot.rotation.y = Math.sin(time * 0.5) * 0.5
      boot.rotation.x = Math.cos(time * 0.3) * 0.3
      boot.rotation.z = Math.sin(time * 0.2) * 0.1

      // Float animation
      boot.position.y = Math.sin(time * 0.8) * 0.3

      // Rotate particles
      particles.rotation.y = time * 0.1
      particles.rotation.x = time * 0.05

      // Animate particle positions
      const positions = particles.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] = Math.sin(time + positions[i]) * 0.5
      }
      particles.geometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}

export default function BootGrey3D() {
  return (
    <Suspense fallback={<div className="w-full h-full bg-neutral-800 animate-pulse" />}>
      <BootGrey3DScene />
    </Suspense>
  )
}
