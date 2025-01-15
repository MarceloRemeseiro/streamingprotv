import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/stream/live_inputs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error('Failed to create live input')
    }

    return NextResponse.json(data.result)
  } catch (error) {
    console.error('Error creating live input:', error)
    return NextResponse.json(
      { error: 'Failed to create live input' },
      { status: 500 }
    )
  }
} 