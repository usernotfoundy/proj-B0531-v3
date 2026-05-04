import * as THREE from 'three'
import { PostProcessor } from './PostProcessor'
import { SUN_POSITION } from './Sun'

export class SceneManager {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    private postProcessor: PostProcessor
    private animationId: number | null = null
    private onTickCallbacks: Array<(delta: number) => void> = []
    private clock: THREE.Clock

    constructor(canvas: HTMLCanvasElement) {
        const w = canvas.clientWidth || window.innerWidth
        const h = canvas.clientHeight || window.innerHeight

        // ── Scene ──────────────────────────────────────────────────────
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x00000f)
        this.scene.fog = new THREE.FogExp2(0x00000f, 0.004)

        // ── Camera ─────────────────────────────────────────────────────
        this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 2000)
        this.camera.position.set(0, 0, 20)
        this.camera.lookAt(0, 0, 0)

        // ── Renderer ───────────────────────────────────────────────────
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
        })
        this.renderer.setSize(w, h)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1.1
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        // ── Post-processing ────────────────────────────────────────────
        // Must be created AFTER renderer
        this.postProcessor = new PostProcessor(
            this.renderer,
            this.scene,
            this.camera
        )

        // ── Lights ─────────────────────────────────────────────────────
        this.addLights()

        // ── Stars ──────────────────────────────────────────────────────
        this.addStarfield()

        // ── Clock ──────────────────────────────────────────────────────
        this.clock = new THREE.Clock()

        // ── Resize ─────────────────────────────────────────────────────
        window.addEventListener('resize', this.handleResize)
    }

    // ── Lights ─────────────────────────────────────────────────────────
    private addLights() {
        // Ambient — lifts shadow side off pure black
        const ambient = new THREE.AmbientLight(0x223344, 1.5)
        this.scene.add(ambient)

        // Sun light — positioned at the actual sun object
        const sunLight = new THREE.PointLight(0xfff4e0, 6, 0, 0)
        sunLight.position.copy(SUN_POSITION)
        sunLight.castShadow = true
        sunLight.shadow.mapSize.width = 1024
        sunLight.shadow.mapSize.height = 1024
        this.scene.add(sunLight)

        // Rim light — cold blue edge on the shadow side
        const rimLight = new THREE.DirectionalLight(0x2255aa, 0.8)
        rimLight.position.set(100, -20, -100)
        this.scene.add(rimLight)
    }

    // ── Starfield ───────────────────────────────────────────────────────
    private addStarfield() {
        const starCount = 8000
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

    // ── Resize ──────────────────────────────────────────────────────────
    private handleResize = () => {
        const width = window.innerWidth
        const height = window.innerHeight

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Resize composer too — critical, otherwise bloom is wrong resolution
        this.postProcessor.resize(width, height)
    }

    // ── Tick registration ────────────────────────────────────────────────
    onTick(fn: (delta: number) => void) {
        this.onTickCallbacks.push(fn)
    }

    // ── Render loop ──────────────────────────────────────────────────────
    start() {
        this.clock.start()
        const loop = () => {
            this.animationId = requestAnimationFrame(loop)
            const delta = this.clock.getDelta()

            for (const cb of this.onTickCallbacks) {
                cb(delta)
            }

            // composer.render() replaces renderer.render()
            this.postProcessor.render()
        }
        loop()
    }

    // ── Cleanup ──────────────────────────────────────────────────────────
    destroy() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId)
        }
        window.removeEventListener('resize', this.handleResize)
        this.postProcessor.dispose()
        this.renderer.dispose()
    }
}