"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function Hero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    rendererRef.current = renderer
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Create rotating wheel geometry
    const wheelGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100)
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0xbd9131,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xbd9131,
      emissiveIntensity: 0.2,
    })

    const wheels: THREE.Mesh[] = []
    for (let i = 0; i < 4; i++) {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
      wheel.position.x = (i - 1.5) * 2
      wheel.rotation.y = Math.PI / 2
      scene.add(wheel)
      wheels.push(wheel)
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xbd9131, 1, 100)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100)
    pointLight2.position.set(-5, -5, 5)
    scene.add(pointLight2)

    // Animation
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      wheels.forEach((wheel, index) => {
        wheel.rotation.x += 0.01 + index * 0.002
        wheel.position.y = Math.sin(Date.now() * 0.001 + index) * 0.2
      })

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)

      wheels.forEach((wheel) => {
        wheel.geometry.dispose()
        if (Array.isArray(wheel.material)) {
          wheel.material.forEach((mat) => mat.dispose())
        } else {
          wheel.material.dispose()
        }
      })

      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 opacity-30" />
}
