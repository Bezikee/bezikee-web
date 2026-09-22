import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Where leads land, and who they appear to come from. bezikee.com is verified in Resend,
// so mail sends from the domain itself: the shared onboarding sender it replaced could only
// deliver to the account's own address and is likelier to be filtered as spam.
const TO = process.env.CONTACT_TO_EMAIL ?? 'wearebezikee@gmail.com'
const FROM = process.env.CONTACT_FROM_EMAIL ?? 'Bezikee <hello@bezikee.com>'

const MAX = { name: 100, email: 200, company: 100, phone: 40, service: 100, budget: 100, message: 5000 }

type Field = keyof typeof MAX

function clean(value: unknown, field: Field): string {
  return typeof value === 'string' ? value.trim().slice(0, MAX[field]) : ''
}

const escapeHtml = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Bots fill every field they find; a real browser leaves the hidden one empty. Answer 200
  // so the bot sees success and doesn't retry with a different shape.
  if (clean(body.website, 'name')) return NextResponse.json({ ok: true })

  const name = clean(body.name, 'name')
  const email = clean(body.email, 'email')
  const message = clean(body.message, 'message')

  // Re-checked here because the client validation is only a convenience: anything can POST
  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Name, a valid email and a message are required' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Misconfiguration, not the visitor's problem: log loudly, tell them it failed so the
    // fallback address is offered rather than showing a success the send never earned.
    console.error('[contact] RESEND_API_KEY is not set; cannot send')
    return NextResponse.json({ error: 'Email is not configured' }, { status: 500 })
  }

  const optional: [string, string][] = [
    ['Company', clean(body.company, 'company')],
    ['Phone', clean(body.phone, 'phone')],
    ['Service', clean(body.service, 'service')],
    ['Budget', clean(body.budget, 'budget')],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]))

  const rows = [['Name', name], ['Email', email], ...optional]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#71717a">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`)
    .join('')

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      // So hitting reply in the inbox goes to the lead, not to the sending address
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        ...optional.map(([k, v]) => `${k}: ${v}`),
        '',
        message,
      ].join('\n'),
      html: `<table style="font-family:system-ui,sans-serif;font-size:14px">${rows}</table>
             <p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap;margin-top:16px">${escapeHtml(message)}</p>`,
    })

    if (error) {
      console.error('[contact] Resend rejected the send:', error)
      return NextResponse.json({ error: 'Could not send the message' }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] send threw:', err)
    return NextResponse.json({ error: 'Could not send the message' }, { status: 502 })
  }
}
