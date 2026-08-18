"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function Boot3DClouds() {
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
    containerRef.current.appendChild(renderer.domElement)

    // Load boot texture
    const textureLoader = new THREE.TextureLoader()
    const bootTexture = textureLoader.load("/images/boot-2.png")

    const bootGeometry = new THREE.PlaneGeometry(3, 3)
    const bootMaterial = new THREE.MeshBasicMaterial({
      map: bootTexture,
      transparent: true,
      side: THREE.DoubleSide,
    })
    const bootMesh = new THREE.Mesh(bootGeometry, bootMaterial)
    bootMesh.position.y = 0.5
    scene.add(bootMesh)

    const glowGeometry = new THREE.PlaneGeometry(3.4, 3.4)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    })
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
    glowMesh.position.z = -0.1
    bootMesh.add(glowMesh)

    const outerGlowGeometry = new THREE.PlaneGeometry(3.8, 3.8)
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xbd9131,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    })
    const outerGlowMesh = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial)
    outerGlowMesh.position.z = -0.15
    bootMesh.add(outerGlowMesh)

    // Create cloud particles
    const cloudParticles: THREE.Mesh[] = []
    const cloudGeometry = new THREE.SphereGeometry(0.3, 16, 16)
    const cloudMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
    })

    // Create multiple cloud layers
    for (let i = 0; i < 30; i++) {
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial.clone())
      cloud.position.set(Math.random() * 6 - 3, Math.random() * 2 - 1.5, Math.random() * 3 - 1.5)
      cloud.scale.setScalar(Math.random() * 0.5 + 0.5)
      cloudParticles.push(cloud)
      scene.add(cloud)
    }

    // Add volumetric fog/mist effect
    scene.fog = new THREE.Fog(0xffffff, 1, 10)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.position.set(2, 3, 2)
    scene.add(directionalLight)

    // Golden rim light for the boot
    const goldenLight = new THREE.PointLight(0xbd9131, 1.5, 10)
    goldenLight.position.set(-2, 1, 2)
    scene.add(goldenLight)

    // Pink/Purple accent lights matching the boot
    const pinkLight = new THREE.PointLight(0xff00ff, 1, 8)
    pinkLight.position.set(2, 0, 2)
    scene.add(pinkLight)

    const purpleLight = new THREE.PointLight(0x8000ff, 1, 8)
    purpleLight.position.set(-2, -1, 2)
    scene.add(purpleLight)

    // Animation
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01

      // Rotate boot slowly
      bootMesh.rotation.y = Math.sin(time * 0.3) * 0.3
      bootMesh.rotation.x = Math.sin(time * 0.5) * 0.1
      bootMesh.rotation.z = Math.cos(time * 0.4) * 0.05

      // Float boot up and down
      bootMesh.position.y = 0.5 + Math.sin(time * 0.5) * 0.3

      glowMaterial.opacity = 0.3 + Math.sin(time * 2) * 0.1
      outerGlowMaterial.opacity = 0.2 + Math.cos(time * 1.5) * 0.08

      // Animate clouds - drift and float
      cloudParticles.forEach((cloud, index) => {
        cloud.position.x += Math.sin(time + index) * 0.001
        cloud.position.y += Math.cos(time * 0.5 + index) * 0.0008
        cloud.rotation.z += 0.001

        // Wrap clouds around
        if (cloud.position.x > 3) cloud.position.x = -3
        if (cloud.position.x < -3) cloud.position.x = 3

        // Pulsing opacity
        const material = cloud.material as THREE.MeshPhongMaterial
        material.opacity = 0.5 + Math.sin(time * 2 + index) * 0.2
      })

      // Animate lights
      goldenLight.intensity = 1.3 + Math.sin(time * 2) * 0.3
      pinkLight.intensity = 0.8 + Math.cos(time * 1.5) * 0.2
      purpleLight.intensity = 0.8 + Math.sin(time * 1.8) * 0.2

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
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
      bootGeometry.dispose()
      bootMaterial.dispose()
      glowGeometry.dispose()
      glowMaterial.dispose()
      outerGlowGeometry.dispose()
      outerGlowMaterial.dispose()
      cloudGeometry.dispose()
      cloudParticles.forEach((cloud) => {
        const material = cloud.material as THREE.MeshPhongMaterial
        material.dispose()
      })
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
