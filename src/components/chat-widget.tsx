'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Leaf, Send, X } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const WELCOME = `Hi! I'm Clover, the Evergreen Hollow Farm assistant.

Ask me about our animals, pricing, hatching eggs, shipping, or permits — I know everything about the farm.`

const CHIPS = ["What's available?", "Do you ship eggs?", "Silkie prices?", "Book a visit"]

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
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  const send = useCallback(async (preset?: string) => {
    const text = (preset || input).trim()
    if (!text || streaming) return

    const userMsg: Message = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setStreaming(true)

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
      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Chat with Clover'}
        className="fixed bottom-[26px] right-[26px] z-[1200] flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
        style={{
          width: 60, height: 60,
          background: 'var(--forest)',
          border: '1.5px solid var(--gold-soft)',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer',
        }}
      >
        {open
          ? <X size={24} style={{ color: 'var(--gold-soft)' }} />
          : <Leaf size={25} style={{ color: 'var(--gold-soft)' }} />
        }
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-[1199] flex flex-col overflow-hidden"
          style={{
            bottom: 98, right: 26,
            width: 370,
            maxWidth: 'calc(100vw - 36px)',
            height: 520,
            maxHeight: '72vh',
            background: 'var(--paper)',
            borderRadius: 12,
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-lg)',
            animation: 'chatIn .3s cubic-bezier(.3,1.2,.5,1)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-[18px] py-4"
            style={{ background: 'var(--forest-deep)' }}
          >
            <span
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{ width: 38, height: 38, background: 'var(--forest)', border: '1.5px solid var(--gold-soft)' }}
            >
              <Leaf size={19} style={{ color: 'var(--gold-soft)' }} />
            </span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--cream)' }}>Clover</div>
              <div className="flex items-center gap-1.5 mt-0.5" style={{ fontSize: 11, color: 'rgba(246,240,228,.55)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#6FBF73', display: 'inline-block' }} />
                Farm assistant · Always online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto flex flex-col gap-3 px-4 py-4"
            style={{ background: 'var(--cream)' }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className="max-w-[85%] rounded-2xl px-[15px] py-[11px] text-[14px] leading-[1.5] whitespace-pre-wrap"
                style={
                  m.role === 'user'
                    ? {
                        alignSelf: 'flex-end',
                        background: 'var(--forest)',
                        color: 'var(--cream)',
                        borderBottomRightRadius: 5,
                      }
                    : {
                        alignSelf: 'flex-start',
                        background: 'var(--paper)',
                        border: '1px solid var(--line)',
                        color: 'var(--ink)',
                        borderBottomLeftRadius: 5,
                      }
                }
              >
                {m.content}
                {m.role === 'assistant' && streaming && i === messages.length - 1 && (
                  <span
                    className="inline-block w-1 h-3.5 ml-0.5 rounded-sm align-middle"
                    style={{ background: 'var(--moss)', animation: 'blink 1.4s infinite both' }}
                  />
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {streaming && messages[messages.length - 1]?.role === 'user' && (
              <div
                className="self-start flex gap-1 px-4 py-3.5 rounded-2xl"
                style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderBottomLeftRadius: 5 }}
              >
                {[0, 0.2, 0.4].map((delay, i) => (
                  <span
                    key={i}
                    className="rounded-full"
                    style={{
                      width: 7, height: 7,
                      background: 'var(--moss)',
                      animation: `blink 1.4s ${delay}s infinite both`,
                      display: 'inline-block',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Lead capture */}
            {showLeadForm && !leadSaved && (
              <div
                className="rounded-2xl p-3 space-y-2"
                style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}
              >
                <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 500 }}>
                  Want follow-up from the farm? (optional)
                </p>
                <input
                  type="text"
                  placeholder="Your name"
                  value={visitorName}
                  onChange={e => setVisitorName(e.target.value)}
                  className="w-full rounded-[var(--r)]"
                  style={{ fontFamily: 'inherit', fontSize: 14, padding: '8px 12px', border: '1.5px solid var(--line)', background: 'var(--cream)', color: 'var(--ink)', outline: 'none' }}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={visitorEmail}
                  onChange={e => setVisitorEmail(e.target.value)}
                  className="w-full rounded-[var(--r)]"
                  style={{ fontFamily: 'inherit', fontSize: 14, padding: '8px 12px', border: '1.5px solid var(--line)', background: 'var(--cream)', color: 'var(--ink)', outline: 'none' }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={submitLead}
                    className="flex-1 font-semibold rounded-[var(--r)] transition-all text-[12px]"
                    style={{ background: 'var(--gold)', color: '#fff', padding: '8px 14px', border: 'none', cursor: 'pointer' }}
                  >
                    Send my info
                  </button>
                  <button
                    onClick={() => setShowLeadForm(false)}
                    className="text-[12px] px-2"
                    style={{ color: 'var(--ink-faint)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Chips */}
          <div
            className="flex gap-1.5 px-3 py-2.5 overflow-x-auto"
            style={{ borderTop: '1px solid var(--line)', background: 'var(--paper)' }}
          >
            {CHIPS.map(q => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={streaming}
                className="whitespace-nowrap rounded-full text-[12px] font-medium px-3 py-1.5 flex-shrink-0 transition-colors disabled:opacity-40"
                style={{ background: 'var(--sand)', border: '1px solid var(--line)', color: 'var(--forest-deep)', cursor: 'pointer' }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            className="flex gap-2 px-3 py-3"
            style={{ borderTop: '1px solid var(--line)', background: 'var(--paper)' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') send() }}
              placeholder="Ask about our animals…"
              disabled={streaming}
              className="flex-1 rounded-full"
              style={{
                fontFamily: 'inherit', fontSize: 14,
                border: '1.5px solid var(--line)',
                padding: '10px 16px',
                background: 'var(--cream)',
                color: 'var(--ink)',
                outline: 'none',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--gold)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--line)' }}
            />
            <button
              onClick={() => send()}
              disabled={streaming || !input.trim()}
              aria-label="Send"
              className="flex items-center justify-center rounded-full flex-shrink-0 disabled:opacity-40 transition-all"
              style={{
                width: 42, height: 42,
                background: 'var(--gold)',
                border: 'none',
                cursor: streaming || !input.trim() ? 'default' : 'pointer',
              }}
            >
              <Send size={18} color="#fff" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatIn { from { transform: translateY(12px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes blink { 0%, 80%, 100% { opacity: .25; } 40% { opacity: 1; } }
      `}</style>
    </>
  )
}
