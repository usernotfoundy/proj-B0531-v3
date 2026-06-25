type Listener = (progress: number) => void

const CRITICAL_ASSETS = ['spaceship'] as const

class LoadingTracker {
    private assets = new Map<string, { loaded: number; total: number }>()
    private listeners = new Set<Listener>()

    report(id: string, loaded: number, total: number) {
        this.assets.set(id, { loaded, total })
        this.notify()
    }

    markComplete(id: string) {
        this.assets.set(id, { loaded: 1, total: 1 })
        this.notify()
    }

    subscribe(listener: Listener): () => void {
        this.listeners.add(listener)
        listener(this.getCriticalProgress())
        return () => this.listeners.delete(listener)
    }

    getCriticalProgress(): number {
        let loaded = 0
        let total = 0

        for (const id of CRITICAL_ASSETS) {
            const entry = this.assets.get(id)
            if (entry) {
                loaded += entry.loaded
                total += entry.total
            }
        }

        if (total === 0) return 0
        return Math.min(loaded / total, 1)
    }

    private notify() {
        const progress = this.getCriticalProgress()
        for (const listener of this.listeners) {
            listener(progress)
        }
    }
}

export const loadingTracker = new LoadingTracker()
