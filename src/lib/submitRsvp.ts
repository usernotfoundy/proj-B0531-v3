export interface RsvpPayload {
    fullName: string
    guestCount: number
}

const RSVP_API_URL = import.meta.env.VITE_RSVP_API_URL ?? '/api/rsvp'
const RSVP_SECRET = import.meta.env.VITE_RSVP_SECRET

export async function submitRsvp({ fullName, guestCount }: RsvpPayload): Promise<void> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    if (RSVP_SECRET) {
        headers['x-rsvp-secret'] = RSVP_SECRET
    }

    const response = await fetch(RSVP_API_URL, {
        method: 'POST',
        headers,
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
