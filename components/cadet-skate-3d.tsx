"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function CadetSkate3D() {
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
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    const textureLoader = new THREE.TextureLoader()
    const skateTexture = textureLoader.load("/images/boot-3.png")

    // Create skate plane with preserved colors
    const skateGeometry = new THREE.PlaneGeometry(4, 4)
    const skateMaterial = new THREE.MeshBasicMaterial({
      map: skateTexture,
      transparent: true,
      side: THREE.DoubleSide,
    })
    const skateMesh = new THREE.Mesh(skateGeometry, skateMaterial)
    scene.add(skateMesh)

    // Create glowing background circles (blue theme for wheels)
    const glowCircles: THREE.Mesh[] = []
    for (let i = 0; i < 3; i++) {
      const circleGeometry = new THREE.RingGeometry(1.5 + i * 0.5, 1.6 + i * 0.5, 64)
      const circleMaterial = new THREE.MeshBasicMaterial({
        color: 0x00bfff,
        transparent: true,
        opacity: 0.3 - i * 0.1,
        side: THREE.DoubleSide,
      })
      const circle = new THREE.Mesh(circleGeometry, circleMaterial)
      circle.position.z = -0.5 - i * 0.2
      glowCircles.push(circle)
      scene.add(circle)
    }

    // Create energy particles (cyan/blue for wheels effect)
    const particleCount = 200
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const radius = 2 + Math.random() * 1
      particlePositions[i * 3] = Math.cos(angle) * radius
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius - 1

      // Cyan/blue particles for wheel glow effect
      const isCyan = Math.random() > 0.5
      particleColors[i * 3] = isCyan ? 0 : 1
      particleColors[i * 3 + 1] = isCyan ? 0.75 : 0.84
      particleColors[i * 3 + 2] = 1
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // Add spotlights
    const blueSpotlight = new THREE.SpotLight(0x00bfff, 3)
    blueSpotlight.position.set(-3, 2, 3)
    scene.add(blueSpotlight)

    const cyanSpotlight = new THREE.SpotLight(0x00ffff, 2)
    cyanSpotlight.position.set(3, -2, 3)
    scene.add(cyanSpotlight)

    const goldenSpotlight = new THREE.SpotLight(0xffd700, 2)
    goldenSpotlight.position.set(0, 3, 2)
    scene.add(goldenSpotlight)

    // Animation
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01

      // Rotate skate gently
      skateMesh.rotation.y = Math.sin(time * 0.5) * 0.3
      skateMesh.rotation.x = Math.sin(time * 0.3) * 0.1
      skateMesh.position.y = Math.sin(time * 2) * 0.1

      // Animate glow circles
      glowCircles.forEach((circle, index) => {
        circle.rotation.z = time * (0.5 + index * 0.2)
        circle.scale.setScalar(1 + Math.sin(time * 2 + index) * 0.1)
      })

      // Animate particles
      const positions = particleGeometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time
        const radius = 2 + Math.random() * 0.5
        positions[i * 3] = Math.cos(angle) * radius
        positions[i * 3 + 2] = Math.sin(angle) * radius - 1
      }
      particleGeometry.attributes.position.needsUpdate = true

      // Pulse spotlights
      blueSpotlight.intensity = 2 + Math.sin(time * 2) * 1
      cyanSpotlight.intensity = 1.5 + Math.cos(time * 2) * 0.5

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
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
