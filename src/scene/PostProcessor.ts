import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

export class PostProcessor {
    private composer: EffectComposer
    private bloomPass: UnrealBloomPass

    constructor(
        renderer: THREE.WebGLRenderer,
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera
    ) {
        // ── Composer ──────────────────────────────────────────────────
        this.composer = new EffectComposer(renderer)

        // ── Pass 1: render the scene normally ─────────────────────────
        const renderPass = new RenderPass(scene, camera)
        this.composer.addPass(renderPass)

        // ── Pass 2: bloom ─────────────────────────────────────────────
        // resolution — matches screen
        const resolution = new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
        )

        this.bloomPass = new UnrealBloomPass(
            resolution,
            0.2,    // strength  — intensity of the glow
            0.4,    // radius    — how far the glow spreads
            0.2,    // threshold — only pixels brighter than this bloom
        )
        this.composer.addPass(this.bloomPass)

        // ── Pass 3: output — correct tone mapping + color space ───────
        // Must be last — handles sRGB conversion after bloom
        const outputPass = new OutputPass()
        this.composer.addPass(outputPass)
    }

    // ── Called every frame instead of renderer.render() ──────────
    render() {
        this.composer.render()
    }

    // ── Called on window resize ───────────────────────────────────
    resize(width: number, height: number) {
        this.composer.setSize(width, height)
        this.bloomPass.resolution.set(width, height)
    }

    // ── Expose bloom controls for live tuning ─────────────────────
    setStrength(value: number) { this.bloomPass.strength = value }
    setRadius(value: number) { this.bloomPass.radius = value }
    setThreshold(value: number) { this.bloomPass.threshold = value }

    dispose() {
        this.composer.dispose()
    }
}