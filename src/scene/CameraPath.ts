import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { SceneManager } from './SceneManager'
import type { PlanetRegistry } from './PlanetRegistry'

gsap.registerPlugin(ScrollTrigger)

const CAMERA_DISTANCE = 18
const CAMERA_ELEVATION = 4

export class CameraPath {
    private sceneManager: SceneManager
    private currentLookAt: THREE.Vector3
    private targetLookAt: THREE.Vector3
    private tl: gsap.core.Timeline | null = null

    constructor(sceneManager: SceneManager, registry: PlanetRegistry) {
        this.sceneManager = sceneManager
        this.currentLookAt = new THREE.Vector3()
        this.targetLookAt = new THREE.Vector3()

        this.buildPath(registry)
        this.registerLookAtTick()
    }

    private buildPath(registry: PlanetRegistry) {
        const planets = registry.getAllPositions()

        if (planets.length === 0) {
            console.warn('[CameraPath] No planets found')
            return
        }

        const camera = this.sceneManager.camera

        // ── Derive one waypoint per planet ───────────────────────────
        const waypoints = planets.map((planet) => ({
            // Camera sits in front of and slightly above each planet
            camX: planet.position.x - CAMERA_DISTANCE * 0.4,
            camY: planet.position.y + CAMERA_ELEVATION,
            camZ: planet.position.z + CAMERA_DISTANCE,
            // LookAt is the planet center
            lookX: planet.position.x,
            lookY: planet.position.y,
            lookZ: planet.position.z,
        }))

        // ── Set camera at the very first waypoint immediately ────────
        camera.position.set(
            waypoints[0].camX,
            waypoints[0].camY,
            waypoints[0].camZ,
        )
        this.currentLookAt.set(
            waypoints[0].lookX,
            waypoints[0].lookY,
            waypoints[0].lookZ,
        )
        this.targetLookAt.copy(this.currentLookAt)
        camera.lookAt(this.currentLookAt)

        // ── Proxy object — GSAP tweens this, we read it each frame ───
        const proxy = {
            camX: waypoints[0].camX,
            camY: waypoints[0].camY,
            camZ: waypoints[0].camZ,
            lookX: waypoints[0].lookX,
            lookY: waypoints[0].lookY,
            lookZ: waypoints[0].lookZ,
        }

        // ── Single master timeline scrubbed by scroll ────────────────
        this.tl = gsap.timeline({
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5,            // floaty space feel — increase for more lag
            },
        })

        // Add one tween per planet — GSAP sequences them equally
        waypoints.forEach((wp) => {
            this.tl!.to(proxy, {
                camX: wp.camX,
                camY: wp.camY,
                camZ: wp.camZ,
                lookX: wp.lookX,
                lookY: wp.lookY,
                lookZ: wp.lookZ,
                // ease: 'power2.inOut',
                duration: 1,           // relative duration — all equal weight
                onUpdate: () => {
                    camera.position.set(proxy.camX, proxy.camY, proxy.camZ)
                    this.targetLookAt.set(proxy.lookX, proxy.lookY, proxy.lookZ)
                },
            })
        })
    }

    // ── Smooth lookAt — lerps every frame toward targetLookAt ─────
    private registerLookAtTick() {
        this.sceneManager.onTick(() => {
            this.currentLookAt.lerp(this.targetLookAt, 0.06)
            this.sceneManager.camera.lookAt(this.currentLookAt)
        })
    }

    destroy() {
        this.tl?.kill()
        ScrollTrigger.getAll().forEach((t) => t.kill())
    }
}