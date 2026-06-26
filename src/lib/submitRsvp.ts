export interface RsvpPayload {
    fullName: string
    guestCount: number
}

const RSVP_API_URL = import.meta.env.VITE_RSVP_API_URL ?? '/api/rsvp'

export async function submitRsvp({ fullName, guestCount }: RsvpPayload): Promise<void> {
    const response = await fetch(RSVP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, guestCount }),
    })

    let data: { error?: string; success?: boolean } | null = null

    try {
        data = await response.json()
    } catch {
        data = null
    }

    if (!response.ok) {
        throw new Error(data?.error ?? 'Failed to submit RSVP. Please try again.')
    }
}
