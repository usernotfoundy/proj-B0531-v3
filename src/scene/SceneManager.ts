import * as THREE from 'three'
import { PostProcessor } from './PostProcessor'
import { SUN_POSITION } from './Sun'
import { getPerformanceProfile } from '../utils/performance'

export class SceneManager {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    private postProcessor: PostProcessor | null = null
    private animationId: number | null = null
    private onTickCallbacks: Array<(delta: number) => void> = []
    private clock: THREE.Clock
    private readonly profile = getPerformanceProfile()
    private visible = true

    constructor(canvas: HTMLCanvasElement) {
        const w = canvas.clientWidth || window.innerWidth
        const h = canvas.clientHeight || window.innerHeight

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x00000f)
        this.scene.fog = new THREE.FogExp2(0x00000f, 0.004)

        this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 2000)
        this.camera.position.set(0, 0, 20)
        this.camera.lookAt(0, 0, 0)

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: this.profile.antialias,
            alpha: false,
            powerPreference: 'high-performance',
        })
        this.renderer.setSize(w, h)
        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, this.profile.pixelRatioCap)
        )
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1.1
        this.renderer.shadowMap.enabled = this.profile.shadows
        if (this.profile.shadows) {
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        }

        if (this.profile.bloom) {
            this.postProcessor = new PostProcessor(
                this.renderer,
                this.scene,
                this.camera
            )
        }

        this.addLights()
        this.addStarfield(this.profile.starCount)

        this.clock = new THREE.Clock()

        window.addEventListener('resize', this.handleResize)
        document.addEventListener('visibilitychange', this.handleVisibility)
    }

    get enableLensflare() {
        return this.profile.lensflare
    }

    private addLights() {
        const ambient = new THREE.AmbientLight(0x223344, 1.5)
        this.scene.add(ambient)

        const sunLight = new THREE.PointLight(0xfff4e0, 6, 0, 0)
        sunLight.position.copy(SUN_POSITION)
        if (this.profile.shadows) {
            sunLight.castShadow = true
            sunLight.shadow.mapSize.width = 512
            sunLight.shadow.mapSize.height = 512
        }
        this.scene.add(sunLight)

        const rimLight = new THREE.DirectionalLight(0x2255aa, 0.8)
        rimLight.position.set(100, -20, -100)
        this.scene.add(rimLight)
    }

    private addStarfield(starCount: number) {
        const positions = new Float32Array(starCount * 3)
        const sizes = new Float32Array(starCount)

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3
            positions[i3] = (Math.random() - 0.5) * 1600
            positions[i3 + 1] = (Math.random() - 0.5) * 1600
            positions[i3 + 2] = (Math.random() - 0.5) * 1600
            sizes[i] = Math.random() * 2.0 + 0.5
        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

        const material = new THREE.PointsMaterial({
            color: 0xe8e8ff,
            size: 0.4,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.9,
        })

        const stars = new THREE.Points(geometry, material)
        this.scene.add(stars)
    }

    private handleResize = () => {
        const width = window.innerWidth
        const height = window.innerHeight

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, this.profile.pixelRatioCap)
        )

        this.postProcessor?.resize(width, height)
    }

    private handleVisibility = () => {
        this.visible = document.visibilityState === 'visible'
        if (this.visible) {
            this.clock.start()
        }
    }

    onTick(fn: (delta: number) => void) {
        this.onTickCallbacks.push(fn)
    }

    start() {
        this.clock.start()
        const loop = () => {
            this.animationId = requestAnimationFrame(loop)

            if (!this.visible) return

            const delta = this.clock.getDelta()

            for (const cb of this.onTickCallbacks) {
                cb(delta)
            }

            if (this.postProcessor) {
                this.postProcessor.render()
            } else {
                this.renderer.render(this.scene, this.camera)
            }
        }
        loop()
    }

    destroy() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId)
        }
        window.removeEventListener('resize', this.handleResize)
        document.removeEventListener('visibilitychange', this.handleVisibility)
        this.postProcessor?.dispose()
        this.renderer.dispose()
    }
}
