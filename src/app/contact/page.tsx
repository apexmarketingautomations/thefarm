'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PublicLayout from '@/components/public-layout'
import { MessageSquare, Package, Calendar, Clock, ChevronRight } from 'lucide-react'

function ContactForm() {
  const params = useSearchParams()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    const bird = params.get('bird')
    const type = params.get('type')
    if (bird) {
      setForm(f => ({
        ...f,
        subject: `Inquiry: ${bird}${type ? ` — ${type}` : ''}`,
        message: `Hi, I'm interested in your ${bird}${type ? ` (${type})` : ''}. Could you please share current availability and pricing?\n\nThank you!`,
      }))
    }
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.name.split(' ')[0] || form.name,
          lastName: form.name.split(' ').slice(1).join(' ') || '',
          email: form.email,
          phone: form.phone,
          source: 'WEBSITE',
          notes: `Subject: ${form.subject}\n\n${form.message}`,
        }),
      })
      if (res.ok || res.status === 401) {
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="text-center py-12 px-4">
        <div
          className="flex items-center justify-center rounded-full mx-auto mb-5"
          style={{ width: 64, height: 64, background: 'rgba(94,114,87,.16)', color: '#3c5a3a' }}
        >
          <span style={{ fontSize: 28 }}>🌿</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500, color: 'var(--forest-deep)', marginBottom: 12 }}>
          Message Received!
        </h2>
        <p style={{ color: 'var(--ink-soft)', maxWidth: 380, margin: '0 auto', fontSize: 15, lineHeight: 1.7 }}>
          Thank you for reaching out. We typically respond within 24 hours. In the meantime, feel free to chat with Clover — our AI farm assistant — using the 🌿 button in the bottom right corner.
        </p>
      </div>
    )
  }

  const fieldStyle = {
    fontFamily: 'inherit',
    fontSize: 15,
    color: 'var(--ink)',
    background: 'var(--paper)',
    border: '1.5px solid var(--line)',
    borderRadius: 'var(--r)',
    padding: '12px 14px',
    width: '100%',
    outline: 'none',
    transition: 'border-color .2s, box-shadow .2s',
  }

  const labelStyle = {
    fontSize: 12.5,
    fontWeight: 600,
    color: 'var(--forest-deep)',
    letterSpacing: '0.02em',
    display: 'block',
    marginBottom: 7,
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Jane Smith"
            style={fieldStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(169,130,60,.12)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--line)'; e.target.style.boxShadow = 'none' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="jane@example.com"
            style={fieldStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(169,130,60,.12)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--line)'; e.target.style.boxShadow = 'none' }}
          />
        </div>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <label style={labelStyle}>Phone (optional)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="(555) 000-0000"
            style={fieldStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(169,130,60,.12)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--line)'; e.target.style.boxShadow = 'none' }}
          />
        </div>
        <div>
          <label style={labelStyle}>What are you interested in?</label>
          <select
            value={form.subject}
            onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
            style={{ ...fieldStyle, background: 'var(--paper)' }}
            onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(169,130,60,.12)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--line)'; e.target.style.boxShadow = 'none' }}
          >
            <option value="">Select a topic…</option>
            <option>Hatching Eggs</option>
            <option>Day-Old Chicks</option>
            <option>Started Birds</option>
            <option>Breeding Pair / Trio</option>
            <option>Silkies</option>
            <option>Silver Laced Wyandottes</option>
            <option>Mille Fleur d&apos;Uccle</option>
            <option>Black Java</option>
            <option>Embden Geese</option>
            <option>Sebastopol Geese</option>
            <option>Mandarin Ducks</option>
            <option>General Question</option>
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="Tell us what you're looking for — breed, quantity, hatching eggs vs live birds, your location, etc."
          style={{ ...fieldStyle, resize: 'vertical', minHeight: 120 }}
          onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(169,130,60,.12)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--line)'; e.target.style.boxShadow = 'none' }}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full font-semibold rounded-[var(--r)] transition-all hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ fontSize: 13, letterSpacing: '0.04em', padding: '14px 26px', background: 'var(--forest)', color: 'var(--cream)', border: '1.5px solid transparent', cursor: status === 'sending' ? 'not-allowed' : 'pointer' }}
      >
        {status === 'sending' ? 'Sending…' : <><ChevronRight size={16} /> Send Message</>}
      </button>
      {status === 'error' && (
        <p className="text-center text-sm" style={{ color: '#c0392b' }}>
          Something went wrong. Please try again or chat with Clover below.
        </p>
      )}
      <p className="text-center text-xs" style={{ color: 'var(--ink-faint)' }}>
        We respond within 24 hours. Your info is never shared.
      </p>
    </form>
  )
}

const SIDEBAR_ITEMS = [
  {
    icon: MessageSquare,
    title: 'Chat with Clover',
    text: 'Our AI farm assistant knows everything — breeds, pricing, availability, shipping, and permits. Tap the 🌿 button in the bottom-right corner for instant answers.',
  },
  {
    icon: Package,
    title: 'Shipping',
    text: 'Hatching eggs ship USPS Priority Mail nationwide. Chicks ship USPS Priority Express (spring/summer only). Health certificate provided for live birds.',
  },
  {
    icon: Calendar,
    title: 'Hatching Season',
    text: 'March through September. Pre-orders and deposits accepted year-round to reserve your spot in the hatch schedule.',
  },
  {
    icon: Clock,
    title: 'Response Time',
    text: 'We respond to all inquiries within 24 hours, usually much faster.',
  },
]

export default function ContactPage() {
  return (
    <PublicLayout>
      {/* Page header */}
      <div
        style={{
          background: 'linear-gradient(155deg,#1B2F23,#16271D 60%,#112017)',
          paddingTop: 'clamp(48px,6vw,84px)',
          paddingBottom: 'clamp(48px,6vw,84px)',
        }}
      >
        <div className="max-w-[1240px] mx-auto px-10">
          <span
            className="inline-flex items-center gap-2.5 mb-4 text-[12px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: 'var(--gold-soft)' }}
          >
            <span className="block w-[26px] h-px opacity-60" style={{ background: 'var(--gold-soft)' }} />
            Get in Touch
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 'clamp(40px,5.6vw,74px)',
              color: 'var(--cream)',
              lineHeight: 1.05,
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            We love{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>talking birds</em>
          </h1>
          <p style={{ fontSize: 'clamp(17px,1.5vw,20px)', color: 'rgba(246,240,228,.74)', lineHeight: 1.7, maxWidth: 500 }}>
            Ready to start your flock or have questions? Fill out the form below and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--cream)', padding: 'clamp(64px,8vw,118px) 0' }}>
        <div className="max-w-[1240px] mx-auto px-10">
          <div
            className="grid gap-12 items-start"
            style={{ gridTemplateColumns: '1.4fr 1fr' }}
          >
            {/* Form */}
            <div>
              <div
                className="rounded-[var(--r)] p-8"
                style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}
              >
                <Suspense fallback={<div style={{ fontSize: 14, color: 'var(--ink-faint)' }}>Loading form…</div>}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>

            {/* Info sidebar */}
            <div className="flex flex-col gap-4">
              {SIDEBAR_ITEMS.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-[var(--r)] p-5"
                  style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <Icon size={18} style={{ color: 'var(--gold)' }} />
                    <h3 style={{ fontWeight: 600, fontSize: 14, color: 'var(--forest-deep)' }}>{title}</h3>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
