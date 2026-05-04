import * as THREE from 'three'
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js'
import type { SceneManager } from './SceneManager'

// Exported so SceneManager can point the sunLight here
export const SUN_POSITION = new THREE.Vector3(-30, 25, -10)

const SUN_RADIUS = 18

export class Sun {
    private group: THREE.Group
    private coreMesh: THREE.Mesh
    private coronaMesh: THREE.Mesh

    constructor(sceneManager: SceneManager) {
        this.group = new THREE.Group()
        this.group.position.copy(SUN_POSITION)
        sceneManager.scene.add(this.group)

        // ── Core sphere ───────────────────────────────────────────────
        this.coreMesh = this.createCore()
        this.group.add(this.coreMesh)

        // ── Corona — soft backside sphere around the core ─────────────
        this.coronaMesh = this.createCorona()
        this.group.add(this.coronaMesh)

        // ── Lens flare ────────────────────────────────────────────────
        this.addLensflare()

        // ── Tick — subtle pulse ───────────────────────────────────────
        this.registerTick(sceneManager)
    }

    // ── Core: bright emissive sphere — bloom does the rest ───────────
    private createCore(): THREE.Mesh {
        const geo = new THREE.SphereGeometry(SUN_RADIUS, 32, 32)
        const mat = new THREE.MeshStandardMaterial({
            color: 0xffdd88,
            emissive: 0xffbb33,
            emissiveIntensity: 3.5,
            roughness: 1.0,
            metalness: 0.0,
        })
        return new THREE.Mesh(geo, mat)
    }

    // ── Corona: large transparent back-facing sphere ─────────────────
    private createCorona(): THREE.Mesh {
        const geo = new THREE.SphereGeometry(SUN_RADIUS * 1.5, 32, 32)
        const mat = new THREE.MeshBasicMaterial({
            color: 0xff9922,
            transparent: true,
            opacity: 0.06,
            side: THREE.BackSide,
            depthWrite: false,
        })
        return new THREE.Mesh(geo, mat)
    }

    // ── Canvas-generated flare texture ───────────────────────────────
    private createFlareTexture(
        size: number,
        innerColor: string,
        outerColor: string,
        falloff = 0.4
    ): THREE.Texture {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')!
        const half = size / 2
        const gradient = ctx.createRadialGradient(half, half, 0, half, half, half)
        gradient.addColorStop(0, innerColor)
        gradient.addColorStop(falloff, outerColor)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, size, size)
        const texture = new THREE.CanvasTexture(canvas)
        return texture
    }

    // ── Star-shaped streak texture for the main flare ─────────────────
    private createStreakTexture(size: number): THREE.Texture {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')!
        const half = size / 2

        // Horizontal streak
        const hGrad = ctx.createLinearGradient(0, half, size, half)
        hGrad.addColorStop(0, 'rgba(255,220,100,0)')
        hGrad.addColorStop(0.4, 'rgba(255,220,100,0.6)')
        hGrad.addColorStop(0.5, 'rgba(255,240,180,1)')
        hGrad.addColorStop(0.6, 'rgba(255,220,100,0.6)')
        hGrad.addColorStop(1, 'rgba(255,220,100,0)')
        ctx.fillStyle = hGrad
        ctx.fillRect(0, half - 2, size, 4)

        // Vertical streak
        const vGrad = ctx.createLinearGradient(half, 0, half, size)
        vGrad.addColorStop(0, 'rgba(255,220,100,0)')
        vGrad.addColorStop(0.4, 'rgba(255,220,100,0.6)')
        vGrad.addColorStop(0.5, 'rgba(255,240,180,1)')
        vGrad.addColorStop(0.6, 'rgba(255,220,100,0.6)')
        vGrad.addColorStop(1, 'rgba(255,220,100,0)')
        ctx.fillStyle = vGrad
        ctx.fillRect(half - 2, 0, 4, size)

        // Core glow dot
        const cGrad = ctx.createRadialGradient(half, half, 0, half, half, half * 0.3)
        cGrad.addColorStop(0, 'rgba(255,255,220,1)')
        cGrad.addColorStop(1, 'rgba(255,220,100,0)')
        ctx.fillStyle = cGrad
        ctx.fillRect(0, 0, size, size)

        return new THREE.CanvasTexture(canvas)
    }

    // ── Lens flare ────────────────────────────────────────────────────
    private addLensflare() {
        const lensflare = new Lensflare()

        // Main glow — largest, centered on the sun
        const mainTex = this.createFlareTexture(
            512,
            'rgba(255, 220, 100, 1)',
            'rgba(255, 140, 30, 0)',
            0.35
        )
        lensflare.addElement(new LensflareElement(mainTex, 900, 0))

        // Star streaks at center
        const streakTex = this.createStreakTexture(512)
        lensflare.addElement(new LensflareElement(streakTex, 700, 0))

        // Warm secondary — slightly offset along flare axis
        const warmTex = this.createFlareTexture(
            128,
            'rgba(255, 180, 60, 0.9)',
            'rgba(255, 120, 20, 0)',
            0.4
        )
        lensflare.addElement(new LensflareElement(warmTex, 140, 0.3))
        lensflare.addElement(new LensflareElement(warmTex, 90, 0.55))
        lensflare.addElement(new LensflareElement(warmTex, 60, 0.75))

        // Chromatic aberration — teal/blue ghosts further along the axis
        const tealTex = this.createFlareTexture(
            128,
            'rgba(80, 200, 255, 0.7)',
            'rgba(40, 140, 255, 0)',
            0.45
        )
        lensflare.addElement(new LensflareElement(tealTex, 80, 1.0))
        lensflare.addElement(new LensflareElement(tealTex, 50, 1.3))

        // Pale ice flare — near the baby blue palette
        const iceTex = this.createFlareTexture(
            128,
            'rgba(167, 216, 245, 0.5)',
            'rgba(137, 194, 217, 0)',
            0.5
        )
        lensflare.addElement(new LensflareElement(iceTex, 110, 1.6))
        lensflare.addElement(new LensflareElement(iceTex, 70, 1.9))
        lensflare.addElement(new LensflareElement(iceTex, 40, 2.2))

        this.group.add(lensflare)
    }

    // ── Tick: subtle pulse on core and corona ─────────────────────────
    private registerTick(sceneManager: SceneManager) {
        let t = 0
        sceneManager.onTick((delta) => {
            t += delta

            // Corona breathes
            const pulse = 1 + Math.sin(t * 1.2) * 0.04
            this.coronaMesh.scale.setScalar(pulse)

            // Core emissive intensity flickers slightly
            const mat = this.coreMesh.material as THREE.MeshStandardMaterial
            mat.emissiveIntensity = 3.5 + Math.sin(t * 2.5) * 0.25
        })
    }

    dispose() {
        this.coreMesh.geometry.dispose()
            ; (this.coreMesh.material as THREE.Material).dispose()
        this.coronaMesh.geometry.dispose()
            ; (this.coronaMesh.material as THREE.Material).dispose()
    }
}