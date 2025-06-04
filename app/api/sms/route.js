import { NextResponse } from 'next/server'
import twilio from 'twilio'
import { cookies } from 'next/headers'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhone = process.env.TWILIO_PHONE

// In-memory store for now
const sentMap = new Map()
const MAX_SMS = 1
const PASSWORD = process.env.SMS_PASSWORD

export async function POST(request) {
  try {
    const { to, message, mode, password } = await request.json()
    if (!to || !message) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    // no bots pls 
    const userAgent = request.headers.get('user-agent') || ''
    if (!userAgent || /bot|crawl|spider|curl|wget|python|scrapy/i.test(userAgent)) {
      return NextResponse.json({ error: 'Bots not allowed' }, { status: 403 })
    }
    // Get IP and cookie
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown'
    const cookieStore = cookies()
    let userId = cookieStore.get('nullsms_uid')?.value
    if (!userId) {
      userId = Math.random().toString(36).slice(2)
      cookieStore.set('nullsms_uid', userId, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 })
    }
    // Check if user has sent SMS
    const key = `${ip}|${userId}`
    const sentCount = sentMap.get(key) || 0
    if (sentCount >= MAX_SMS) {
      // If password provided, check it
      if (password === PASSWORD) {
        // allow, but do not increment count
      } else {
        return NextResponse.json({ requirePassword: true }, { status: 401 })
      }
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
    if (!password) sentMap.set(key, sentCount + 1)
    return NextResponse.json({ success: true, sid: sms.sid })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
