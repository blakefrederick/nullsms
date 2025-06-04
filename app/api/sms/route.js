import { NextResponse } from 'next/server'
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhone = process.env.TWILIO_PHONE

export async function POST(request) {
  try {
    const { to, message, mode } = await request.json()
    if (!to || !message) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    // Only check 160-char limit for normal mode
    if ((!mode || mode === 'normal') && message.length > 160) {
      return NextResponse.json(
        { error: 'Message must be 160 chars or less' },
        { status: 400 },
      )
    }
    const client = twilio(accountSid, authToken)
    const sms = await client.messages.create({
      body: message,
      from: twilioPhone,
      to,
    })
    return NextResponse.json({ success: true, sid: sms.sid })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
