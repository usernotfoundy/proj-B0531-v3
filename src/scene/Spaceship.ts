import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import gsap from 'gsap'
import type { SceneManager } from './SceneManager'
import { loadingTracker } from './LoadingTracker'

function createModelLoader() {
    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    return loader
}

// Middle-bottom third person — centered, low in frame, close
const OFFSET_X = 0.0
const OFFSET_Y = -2.8
const OFFSET_Z = 6.0   // positive = in front of camera

export class Spaceship {
    private group: THREE.Group
    private model: THREE.Group | null = null
    loaded = false       // public — SplashScreen reads this

    private targetPosition = new THREE.Vector3()
    private prevCamPos = new THREE.Vector3()
    private velocity = new THREE.Vector3()

    // Resolves when entry animation finishes — SplashScreen awaits this
    private onReadyResolve: (() => void) | null = null
    readonly ready: Promise<void>

    constructor(sceneManager: SceneManager) {
        this.group = new THREE.Group()
        sceneManager.scene.add(this.group)

        this.ready = new Promise((resolve) => {
            this.onReadyResolve = resolve
        })

        this.load(sceneManager)
    }

    private load(sceneManager: SceneManager) {
        const loader = createModelLoader()

        loader.load(
            '/models/spaceship.glb',

            (gltf) => {
                const model = gltf.scene

                // ── Normalize size ─────────────────────────────────────
                const box = new THREE.Box3().setFromObject(model)
                const size = new THREE.Vector3()
                box.getSize(size)
                const rawSize = Math.max(size.x, size.y, size.z)
                const normalizedScale = 5.0 / rawSize
                model.scale.setScalar(normalizedScale)

                // ── Re-center ──────────────────────────────────────────
                const scaledBox = new THREE.Box3().setFromObject(model)
                const center = new THREE.Vector3()
                scaledBox.getCenter(center)
                model.position.sub(center)

                // ── Flip ship to face away from camera (thrusters toward viewer) ──
                model.rotation.x = 200
                model.rotation.y = 350
                model.rotation.z = 150

                // ── Materials ──────────────────────────────────────────
                model.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh
                        mesh.castShadow = true
                        if (mesh.material instanceof THREE.MeshStandardMaterial) {
                            mesh.material.envMapIntensity = 0.1
                            mesh.material.emissiveIntensity = 0.0
                            mesh.material.needsUpdate = true
                        }
                    }
                })

                this.group.add(model)
                this.model = model
                this.loaded = true

                // ── Entry animation ────────────────────────────────────
                // Start far below the camera, nose pitched down
                const cam = sceneManager.camera
                this.group.position.set(
                    cam.position.x,
                    cam.position.y - 80,
                    cam.position.z - OFFSET_Z,  // start in front, far below
                )
                this.group.rotation.x = 0.5   // nose tilted down on launch

                const tl = gsap.timeline({
                    onComplete: () => {
                        this.onReadyResolve?.()   // unblocks SplashScreen dismiss
                    }
                })

                // Phase 1 — fast launch upward
                tl.to(this.group.position, {
                    x: cam.position.x,
                    y: cam.position.y + OFFSET_Y + 4,
                    z: cam.position.z - OFFSET_Z,
                    duration: 1.6,
                    ease: 'power3.in',
                    delay: 0.6,
                })

                // Phase 2 — slow into final position, level out
                tl.to(this.group.position, {
                    x: cam.position.x + OFFSET_X,
                    y: cam.position.y + OFFSET_Y,
                    z: cam.position.z + OFFSET_Z,
                    duration: 1.2,
                    ease: 'power2.out',
                }, '-=0.2')

                tl.to(this.group.rotation, {
                    x: 0,
                    duration: 1.0,
                    ease: 'power2.out',
                }, '<')

                this.prevCamPos.copy(cam.position)
                this.registerTick(sceneManager)

                loadingTracker.markComplete('spaceship')
                console.log('[Spaceship] ✓ loaded')
            },

            (event) => {
                if (event.lengthComputable) {
                    loadingTracker.report('spaceship', event.loaded, event.total)
                }
            },

            (error) => console.error('[Spaceship] ✗ failed to load', error)
        )
    }

    private registerTick(sceneManager: SceneManager) {
        const camRight = new THREE.Vector3()
        const camUp = new THREE.Vector3()
        const camForward = new THREE.Vector3()
        const worldOffset = new THREE.Vector3()

        sceneManager.onTick(() => {
            if (!this.loaded) return

            const camera = sceneManager.camera
            camera.matrixWorld.extractBasis(camRight, camUp, camForward)
            camForward.negate()

            worldOffset
                .set(0, 0, 0)
                .addScaledVector(camRight, OFFSET_X)
                .addScaledVector(camUp, OFFSET_Y)
                .addScaledVector(camForward, OFFSET_Z)

            this.targetPosition.copy(camera.position).add(worldOffset)
            this.group.position.lerp(this.targetPosition, 0.18)

            // ── Velocity for banking ───────────────────────────────
            this.velocity.subVectors(camera.position, this.prevCamPos)
            this.prevCamPos.copy(camera.position)

            const bank = -this.velocity.x * 20
            const pitch = this.velocity.z * 6

            this.group.rotation.z = THREE.MathUtils.lerp(
                this.group.rotation.z,
                THREE.MathUtils.clamp(bank, -0.35, 0.35),
                0.15
            )
            this.group.rotation.x = THREE.MathUtils.lerp(
                this.group.rotation.x,
                THREE.MathUtils.clamp(pitch, -0.25, 0.25),
                0.15
            )
        })
    }

    dispose() {
        if (!this.model) return
        this.model.traverse((child) => {
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
    }
}