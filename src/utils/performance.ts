export interface PerformanceProfile {
    pixelRatioCap: number
    antialias: boolean
    shadows: boolean
    bloom: boolean
    lensflare: boolean
    starCount: number
}

export function getPerformanceProfile(): PerformanceProfile {
    const isMobile = window.innerWidth < 768
    const isLowEnd =
        navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isMobile || isLowEnd || reducedMotion) {
        return {
            pixelRatioCap: 1,
            antialias: false,
            shadows: false,
            bloom: false,
            lensflare: false,
            starCount: 2500,
        }
    }

    return {
        pixelRatioCap: 2,
        antialias: true,
        shadows: true,
        bloom: true,
        lensflare: true,
        starCount: 6000,
    }
}
