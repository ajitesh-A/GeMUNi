'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatPanelProps {
  reportId: string
}

const SUGGESTIONS = [
  'Summarize this report',
  'Counter arguments?',
  'Key sources',
]

function SparkleIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
    </svg>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: '0ms' }} />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: '150ms' }} />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

function formatTime() {
  const now = new Date()
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function ChatPanel({ reportId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "I'm your research assistant. Ask me anything about this report — voting records, specific sources, counterarguments, or speaking points.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_id: reportId, message: input.trim() }),
      })

      if (!res.ok) throw new Error('Chat failed')

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I encountered an error. Please try again or check that the AI engine is running.',
        },
      ])
    }
    setLoading(false)
  }

  function handleSuggestion(text: string) {
    setInput(text)
    inputRef.current?.focus()
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 bg-accent px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-white">
          <SparkleIcon />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">AI Research Chat</h3>
          <p className="text-xs text-white/70">Ask follow-up questions about this report</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex max-w-[85%] gap-2.5">
                {msg.role === 'assistant' && (
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary dark:bg-primary/20">
                    <SparkleIcon />
                  </div>
                )}
                <div>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-accent text-white'
                        : 'bg-gray-50 text-card-fg dark:bg-gray-800'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <p className="mt-1 px-1 text-[10px] text-muted">{formatTime()}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] gap-2.5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary dark:bg-primary/20">
                  <SparkleIcon />
                </div>
                <div className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
                  <TypingDots />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((text) => (
              <button
                key={text}
                onClick={() => handleSuggestion(text)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted hover:border-primary hover:text-primary transition-colors"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            disabled={loading}
            className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-card-fg placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-white hover:bg-accent-600 disabled:opacity-40 transition-colors"
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
