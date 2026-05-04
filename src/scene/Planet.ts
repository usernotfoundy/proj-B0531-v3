import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { SceneManager } from './SceneManager'
import type { PlanetConfig } from '../types/planet.types'

export class Planet {
    config: PlanetConfig
    group: THREE.Group              // world-space anchor — never rotated
    private model: THREE.Group | null = null   // inner mesh — this rotates
    private mixer: THREE.AnimationMixer | null = null
    private loaded = false

    constructor(config: PlanetConfig, sceneManager: SceneManager) {
        this.config = config
        this.group = new THREE.Group()
        this.group.position.set(...config.position)
        sceneManager.scene.add(this.group)

        this.load(config, sceneManager)
    }

    private load(config: PlanetConfig, sceneManager: SceneManager) {
        const loader = new GLTFLoader()

        loader.load(
            config.modelPath,

            (gltf) => {
                const model = gltf.scene

                // ── Step 1: measure raw size before any scaling
                const box = new THREE.Box3().setFromObject(model)
                const size = new THREE.Vector3()
                box.getSize(size)
                const rawSize = Math.max(size.x, size.y, size.z)

                if (rawSize === 0) {
                    console.warn(`[Planet] ${config.id} has zero size — check the GLB`)
                    return
                }

                // ── Step 2: normalize scale to displaySize
                const multiplier = config.scale ?? 1
                const normalizedScale = (config.displaySize / rawSize) * multiplier
                model.scale.setScalar(normalizedScale)

                // ── Step 3: re-center model at the group's local origin
                // This is critical — if the pivot is off, rotation will orbit
                const scaledBox = new THREE.Box3().setFromObject(model)
                const center = new THREE.Vector3()
                scaledBox.getCenter(center)
                model.position.sub(center)

                // ── Step 4: shadows + material
                model.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh
                        mesh.castShadow = true
                        mesh.receiveShadow = true
                        if (mesh.material instanceof THREE.MeshStandardMaterial) {
                            mesh.material.envMapIntensity = 0.3
                            mesh.material.needsUpdate = true
                        }
                    }
                })

                // ── Step 5: add model to group — group stays at world position
                this.group.add(model)
                this.model = model   // store reference for rotation
                this.loaded = true

                // ── Step 6: animations
                if (gltf.animations.length > 0) {
                    this.mixer = new THREE.AnimationMixer(model)
                    const action = this.mixer.clipAction(gltf.animations[0])
                    action.play()
                }

                // ── Step 7: rotate the MODEL, never the group
                const speed = config.rotationSpeed ?? 0.002
                sceneManager.onTick((delta) => {
                    if (!this.loaded || !this.model) return
                    this.model.rotation.y += speed   // ← model rotates, group stays fixed
                    this.mixer?.update(delta)
                })

                console.log(
                    `[Planet] ✓ ${config.id} | raw: ${rawSize.toFixed(2)} | ` +
                    `scale: ${normalizedScale.toFixed(4)} | display: ${config.displaySize}`
                )
            },

            (event) => {
                if (event.lengthComputable) {
                    const pct = Math.round((event.loaded / event.total) * 100)
                    console.log(`[Planet] ${config.id} — ${pct}%`)
                }
            },

            (error) => {
                console.error(`[Planet] ✗ failed to load: ${config.id}`, error)
            }
        )
    }

    getWorldPosition(): THREE.Vector3 {
        return this.group.position.clone()
    }

    getRadius(): number {
        if (!this.model) return this.config.displaySize * 0.5
        const box = new THREE.Box3().setFromObject(this.model)
        const size = new THREE.Vector3()
        box.getSize(size)
        return Math.max(size.x, size.y, size.z) * 0.5
    }

    dispose() {
        this.group.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh
                mesh.geometry.dispose()
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((m) => m.dispose())
                } else {
                    mesh.material.dispose()
                }
            }
        })
        this.model = null
        this.mixer = null
    }
}