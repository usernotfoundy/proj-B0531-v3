import { google } from 'googleapis'

function getSheetsClient() {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (!email || !privateKey) {
        throw new Error('Google Sheets credentials are not configured')
    }

    const auth = new google.auth.JWT({
        email,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    return google.sheets({ version: 'v4', auth })
}

function validatePayload(body) {
    const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : ''
    const guestCount = Number(body?.guestCount)

    if (!fullName) {
        return { error: 'Full name is required' }
    }

    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20) {
        return { error: 'Guest count must be between 1 and 20' }
    }

    return { fullName, guestCount }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const expectedSecret = process.env.RSVP_SECRET
    if (expectedSecret) {
        const providedSecret = req.headers['x-rsvp-secret'] ?? req.body?.secret
        if (providedSecret !== expectedSecret) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
    }

    const sheetId = process.env.GOOGLE_SHEET_ID
    if (!sheetId) {
        return res.status(500).json({ error: 'Google Sheet is not configured' })
    }

    const validation = validatePayload(req.body)
    if (validation.error) {
        return res.status(400).json({ error: validation.error })
    }

    const { fullName, guestCount } = validation
    const sheetTab = process.env.GOOGLE_SHEET_TAB || 'RSVP'

    try {
        const sheets = getSheetsClient()

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: `${sheetTab}!A:D`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    new Date().toISOString(),
                    fullName,
                    guestCount,
                    'invitation-modal',
                ]],
            },
        })

        return res.status(200).json({ success: true })
    } catch (err) {
        console.error('RSVP sheet append failed:', err)
        return res.status(500).json({
            error: err instanceof Error ? err.message : 'Failed to save RSVP',
        })
    }
}
