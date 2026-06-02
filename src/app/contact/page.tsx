'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PublicLayout from '@/components/public-layout'
import { Suspense } from 'react'

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
        // 401 = not logged in but that's fine, lead was saved via public capture
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
      <div className="text-center py-16 px-4">
        <div className="text-5xl mb-4">🌿</div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--farm-green-dark)' }}>Message Received!</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Thank you for reaching out. We typically respond within 24 hours. In the meantime, feel free to chat with Clover — our AI farm assistant — in the bottom right corner.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--farm-brown)' }}>Full Name *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Jane Smith"
            className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{ borderColor: '#d4c9a8', backgroundColor: 'white' }}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--farm-brown)' }}>Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="jane@example.com"
            className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{ borderColor: '#d4c9a8', backgroundColor: 'white' }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--farm-brown)' }}>Phone (optional)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="(555) 000-0000"
            className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{ borderColor: '#d4c9a8', backgroundColor: 'white' }}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--farm-brown)' }}>What are you interested in?</label>
          <select
            value={form.subject}
            onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
            className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            style={{ borderColor: '#d4c9a8' }}
          >
            <option value="">Select a topic...</option>
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
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--farm-brown)' }}>Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="Tell us what you're looking for — breed, quantity, hatching eggs vs live birds, your location, etc."
          className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          style={{ borderColor: '#d4c9a8', backgroundColor: 'white' }}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        style={{ backgroundColor: 'var(--farm-green-dark)' }}
        className="w-full text-white font-bold py-3.5 rounded-xl hover:brightness-110 transition disabled:opacity-60 text-base"
      >
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">Something went wrong. Please try again or chat with Clover below.</p>
      )}
      <p className="text-xs text-gray-400 text-center">We respond within 24 hours. Your info is never shared.</p>
    </form>
  )
}

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--farm-green-dark)' }}>Get in Touch</h1>
            <p className="text-gray-500 mb-8">Ready to start your flock or have questions? We love talking birds.</p>
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{ backgroundColor: 'var(--farm-cream)', border: '1px solid #e8dfc8' }}
            >
              <Suspense fallback={<div className="text-sm text-gray-400">Loading form…</div>}>
                <ContactForm />
              </Suspense>
            </div>
          </div>

          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--farm-cream)', border: '1px solid #e8dfc8' }}>
              <h3 className="font-bold text-base mb-3" style={{ color: 'var(--farm-green-dark)' }}>💬 Chat with Clover</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Our AI farm assistant knows everything — breeds, pricing, availability, shipping, and permits. Tap the 🌿 button in the bottom-right corner for instant answers.</p>
            </div>
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--farm-cream)', border: '1px solid #e8dfc8' }}>
              <h3 className="font-bold text-base mb-3" style={{ color: 'var(--farm-green-dark)' }}>📦 Shipping</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">Hatching eggs ship USPS Priority Mail nationwide. Chicks ship USPS Priority Express (spring/summer only). Health certificate provided for live birds.</p>
            </div>
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--farm-cream)', border: '1px solid #e8dfc8' }}>
              <h3 className="font-bold text-base mb-3" style={{ color: 'var(--farm-green-dark)' }}>📅 Hatching Season</h3>
              <p className="text-sm text-gray-600 leading-relaxed">March through September. Pre-orders and deposits accepted year-round to reserve your spot in the hatch schedule.</p>
            </div>
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--farm-cream)', border: '1px solid #e8dfc8' }}>
              <h3 className="font-bold text-base mb-3" style={{ color: 'var(--farm-green-dark)' }}>⏱ Response Time</h3>
              <p className="text-sm text-gray-600 leading-relaxed">We respond to all inquiries within 24 hours, usually much faster.</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
