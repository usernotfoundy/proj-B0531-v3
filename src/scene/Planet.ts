import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import type { SceneManager } from './SceneManager'
import type { PlanetConfig } from '../types/planet.types'
import { loadingTracker } from './LoadingTracker'

function createModelLoader() {
    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    return loader
}

export class Planet {
    config: PlanetConfig
    group: THREE.Group
    private model: THREE.Group | null = null
    private mixer: THREE.AnimationMixer | null = null
    private loaded = false
    private loadStarted = false
    private sceneManager: SceneManager

    constructor(config: PlanetConfig, sceneManager: SceneManager) {
        this.config = config
        this.sceneManager = sceneManager
        this.group = new THREE.Group()
        this.group.position.set(...config.position)
        sceneManager.scene.add(this.group)
    }

    load() {
        if (this.loadStarted) return
        this.loadStarted = true

        const loader = createModelLoader()
        const trackerId = this.config.id

        loader.load(
            this.config.modelPath,

            (gltf) => {
                const model = gltf.scene

                const box = new THREE.Box3().setFromObject(model)
                const size = new THREE.Vector3()
                box.getSize(size)
                const rawSize = Math.max(size.x, size.y, size.z)

                if (rawSize === 0) {
                    console.warn(`[Planet] ${this.config.id} has zero size — check the GLB`)
                    return
                }

                const multiplier = this.config.scale ?? 1
                const normalizedScale = (this.config.displaySize / rawSize) * multiplier
                model.scale.setScalar(normalizedScale)

                const scaledBox = new THREE.Box3().setFromObject(model)
                const center = new THREE.Vector3()
                scaledBox.getCenter(center)
                model.position.sub(center)

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

                this.group.add(model)
                this.model = model
                this.loaded = true
                loadingTracker.markComplete(trackerId)

                if (gltf.animations.length > 0) {
                    this.mixer = new THREE.AnimationMixer(model)
                    const action = this.mixer.clipAction(gltf.animations[0])
                    action.play()
                }

                const speed = this.config.rotationSpeed ?? 0.002
                this.sceneManager.onTick((delta) => {
                    if (!this.loaded || !this.model) return
                    this.model.rotation.y += speed
                    this.mixer?.update(delta)
                })
            },

            (event) => {
                if (event.lengthComputable) {
                    loadingTracker.report(trackerId, event.loaded, event.total)
                }
            },

            (error) => {
                console.error(`[Planet] ✗ failed to load: ${this.config.id}`, error)
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
