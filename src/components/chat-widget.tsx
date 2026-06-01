'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const WELCOME = `Hi there! 🌿 I'm Clover, the Evergreen Hollow Farm assistant.

I can help you with:
• Breeds & availability
• Pricing & ordering
• Hatching eggs & shipping
• Care & husbandry questions
• Regulations & permits

What can I help you with today?`

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME },
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [visitorEmail, setVisitorEmail] = useState('')
  const [visitorName, setVisitorName] = useState('')
  const [leadSaved, setLeadSaved] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg: Message = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setStreaming(true)

    // Show lead form after 2nd user message if no email yet
    if (!leadSaved && next.filter(m => m.role === 'user').length === 2) {
      setShowLeadForm(true)
    }

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          visitorEmail: visitorEmail || undefined,
          visitorName: visitorName || undefined,
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: 'Something went wrong' }))
        setMessages(m => [...m, { role: 'assistant', content: `Sorry, I hit a snag: ${err.error}` }])
        return
      }

      // Stream the response
      setMessages(m => [...m, { role: 'assistant', content: '' }])
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages(m => {
          const updated = [...m]
          updated[updated.length - 1] = {
            role: 'assistant',
            content: updated[updated.length - 1].content + chunk,
          }
          return updated
        })
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMessages(m => [...m, { role: 'assistant', content: 'Connection lost — please try again.' }])
      }
    } finally {
      setStreaming(false)
    }
  }, [input, messages, streaming, visitorEmail, visitorName, leadSaved])

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const submitLead = async () => {
    if (!visitorEmail) return
    setLeadSaved(true)
    setShowLeadForm(false)
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: '__lead_capture__' }],
          visitorEmail,
          visitorName,
        }),
      })
    } catch { /* non-blocking */ }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Chat with Clover'}
        style={{ backgroundColor: 'var(--farm-green-dark)' }}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white text-2xl hover:brightness-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
      >
        {open ? '✕' : '🌿'}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-green-900/20"
          style={{ height: '520px', backgroundColor: 'var(--farm-cream)' }}
        >
          {/* Header */}
          <div
            style={{ backgroundColor: 'var(--farm-green-dark)' }}
            className="px-4 py-3 flex items-center gap-3"
          >
            <span className="text-2xl">🐔</span>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">Clover</p>
              <p className="text-green-200 text-xs">Evergreen Hollow Farm Assistant</p>
            </div>
            <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <span className="mr-1.5 mt-1 text-base flex-shrink-0">🌿</span>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'text-white rounded-br-sm'
                      : 'text-gray-800 rounded-bl-sm border border-green-100'
                  }`}
                  style={
                    m.role === 'user'
                      ? { backgroundColor: 'var(--farm-green)' }
                      : { backgroundColor: '#fff' }
                  }
                >
                  {m.content}
                  {m.role === 'assistant' && streaming && i === messages.length - 1 && (
                    <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-green-600 animate-pulse rounded-sm align-middle" />
                  )}
                </div>
              </div>
            ))}

            {/* Lead capture form */}
            {showLeadForm && !leadSaved && (
              <div className="bg-white border border-green-100 rounded-2xl px-3 py-3 space-y-2">
                <p className="text-xs text-gray-600 font-medium">
                  Want follow-up from the farm? (optional)
                </p>
                <input
                  type="text"
                  placeholder="Your name"
                  value={visitorName}
                  onChange={e => setVisitorName(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={visitorEmail}
                  onChange={e => setVisitorEmail(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={submitLead}
                    style={{ backgroundColor: 'var(--farm-green)' }}
                    className="flex-1 text-white text-xs py-1.5 rounded-lg hover:brightness-110 transition"
                  >
                    Send my info
                  </button>
                  <button
                    onClick={() => setShowLeadForm(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 px-2"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="px-3 py-2 border-t flex gap-2 items-end"
            style={{ borderColor: '#e2ddd4', backgroundColor: 'var(--farm-straw)' }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about breeds, pricing, availability…"
              rows={1}
              disabled={streaming}
              className="flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-60 max-h-24"
              style={{ lineHeight: '1.4' }}
            />
            <button
              onClick={send}
              disabled={streaming || !input.trim()}
              style={{ backgroundColor: 'var(--farm-green-dark)' }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Send"
            >
              <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
