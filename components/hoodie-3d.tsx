"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function Hoodie3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
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
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Create hoodie geometry (simplified hoodie shape)
    const hoodieGroup = new THREE.Group()

    // Main body
    const bodyGeometry = new THREE.BoxGeometry(1.8, 2, 0.6)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Navy blue
      roughness: 0.7,
      metalness: 0.1,
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.y = 0
    hoodieGroup.add(body)

    // Hood
    const hoodGeometry = new THREE.SphereGeometry(0.7, 32, 32, 0, Math.PI)
    const hood = new THREE.Mesh(hoodGeometry, bodyMaterial)
    hood.position.set(0, 1.2, 0.1)
    hood.rotation.x = Math.PI / 2
    hoodieGroup.add(hood)

    // Left sleeve
    const sleeveGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1.5, 32)
    const leftSleeve = new THREE.Mesh(sleeveGeometry, bodyMaterial)
    leftSleeve.position.set(-1.1, 0.2, 0)
    leftSleeve.rotation.z = Math.PI / 6
    hoodieGroup.add(leftSleeve)

    // Right sleeve
    const rightSleeve = new THREE.Mesh(sleeveGeometry, bodyMaterial)
    rightSleeve.position.set(1.1, 0.2, 0)
    rightSleeve.rotation.z = -Math.PI / 6
    hoodieGroup.add(rightSleeve)

    // Pocket
    const pocketGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.3)
    const pocketMaterial = new THREE.MeshStandardMaterial({
      color: 0x152a6b,
      roughness: 0.8,
    })
    const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial)
    pocket.position.set(0, 0, 0.45)
    hoodieGroup.add(pocket)

    // Add golden Auriga Racing logo on chest (simplified as a golden rectangle)
    const logoGeometry = new THREE.PlaneGeometry(0.6, 0.3)
    const logoMaterial = new THREE.MeshStandardMaterial({
      color: 0xbd9131,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0xbd9131,
      emissiveIntensity: 0.2,
    })
    const logo = new THREE.Mesh(logoGeometry, logoMaterial)
    logo.position.set(0, 0.5, 0.31)
    hoodieGroup.add(logo)

    // Add drawstrings
    const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8)
    const stringMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })

    const leftString = new THREE.Mesh(stringGeometry, stringMaterial)
    leftString.position.set(-0.15, 1, 0.4)
    leftString.rotation.x = Math.PI / 4
    hoodieGroup.add(leftString)

    const rightString = new THREE.Mesh(stringGeometry, stringMaterial)
    rightString.position.set(0.15, 1, 0.4)
    rightString.rotation.x = Math.PI / 4
    hoodieGroup.add(rightString)

    scene.add(hoodieGroup)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight1.position.set(5, 5, 5)
    scene.add(directionalLight1)

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)
    directionalLight2.position.set(-5, -5, -5)
    scene.add(directionalLight2)

    // Golden rim light for dramatic effect
    const rimLight = new THREE.DirectionalLight(0xbd9131, 0.5)
    rimLight.position.set(0, 0, -5)
    scene.add(rimLight)

    // Animation
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Smooth rotation
      hoodieGroup.rotation.y += 0.01

      // Gentle bobbing motion
      hoodieGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
