import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PLANETS } from '../config/planets.config'
import { getMaxScrollPx, SCROLL_CONTAINER_ID } from '../config/scroll.config'
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
    private scrollTrigger: ScrollTrigger | null = null

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

        if (planets.length !== PLANETS.length) {
            console.warn(
                `[CameraPath] Registry has ${planets.length} planets but config has ${PLANETS.length}`
            )
        }

        const camera = this.sceneManager.camera

        const waypoints = planets.map((planet) => ({
            camX: planet.position.x - CAMERA_DISTANCE * 0.4,
            camY: planet.position.y + CAMERA_ELEVATION,
            camZ: planet.position.z + CAMERA_DISTANCE,
            lookX: planet.position.x,
            lookY: planet.position.y,
            lookZ: planet.position.z,
        }))

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

        const proxy = {
            camX: waypoints[0].camX,
            camY: waypoints[0].camY,
            camZ: waypoints[0].camZ,
            lookX: waypoints[0].lookX,
            lookY: waypoints[0].lookY,
            lookZ: waypoints[0].lookZ,
        }

        // Build the full path first — ScrollTrigger must measure a complete timeline
        this.tl = gsap.timeline()

        waypoints.slice(1).forEach((wp) => {
            this.tl!.to(proxy, {
                camX: wp.camX,
                camY: wp.camY,
                camZ: wp.camZ,
                lookX: wp.lookX,
                lookY: wp.lookY,
                lookZ: wp.lookZ,
                duration: 1,
                onUpdate: () => {
                    camera.position.set(proxy.camX, proxy.camY, proxy.camZ)
                    this.targetLookAt.set(proxy.lookX, proxy.lookY, proxy.lookZ)
                },
            })
        })

        const scrollEl = document.getElementById(SCROLL_CONTAINER_ID) ?? document.body

        this.scrollTrigger = ScrollTrigger.create({
            animation: this.tl,
            trigger: scrollEl,
            start: 'top top',
            end: () => `+=${getMaxScrollPx()}`,
            scrub: 1.5,
            invalidateOnRefresh: true,
        })

        requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    private registerLookAtTick() {
        this.sceneManager.onTick(() => {
            this.currentLookAt.lerp(this.targetLookAt, 0.06)
            this.sceneManager.camera.lookAt(this.currentLookAt)
        })
    }

    destroy() {
        this.scrollTrigger?.kill()
        this.scrollTrigger = null
        this.tl?.kill()
        this.tl = null
    }
}
