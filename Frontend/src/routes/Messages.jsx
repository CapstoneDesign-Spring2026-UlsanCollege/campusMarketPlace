import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchMessageThreads, fetchThreadMessages, openMessageThread, sendThreadMessage } from '../services/api'

const POLL_INTERVAL_MS = 4000

function formatTime(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export default function Messages() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [threads, setThreads] = useState([])
  const [activeThreadId, setActiveThreadId] = useState('')
  const [activeThread, setActiveThread] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const bottomRef = useRef(null)

  const itemId = searchParams.get('item') || ''

  const user = useMemo(() => {
    const raw = localStorage.getItem('campusMarketplaceUser')
    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('campusMarketplaceToken')
    if (!token) {
      navigate('/login', { replace: true, state: { message: 'Please log in first.' } })
      return
    }

    let isActive = true

    async function bootstrap() {
      try {
        setIsLoading(true)
        setError('')
        const threadData = await fetchMessageThreads()
        if (!isActive) {
          return
        }

        const nextThreads = Array.isArray(threadData?.threads) ? threadData.threads : []
        setThreads(nextThreads)

        let nextThread = null
        if (itemId) {
          const opened = await openMessageThread(itemId)
          nextThread = opened?.thread || null
        } else if (nextThreads.length > 0) {
          nextThread = nextThreads[0]
        }

        if (nextThread && isActive) {
          setActiveThreadId(nextThread._id)
          setActiveThread(nextThread)
          const threadMessages = await fetchThreadMessages(nextThread._id)
          if (!isActive) {
            return
          }
          setMessages(Array.isArray(threadMessages?.messages) ? threadMessages.messages : [])
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Unable to load messages right now.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    bootstrap()

    return () => {
      isActive = false
    }
  }, [navigate, itemId])

  useEffect(() => {
    if (!activeThreadId) {
      return undefined
    }

    let isActive = true

    async function refreshConversation() {
      try {
        const threadData = await fetchThreadMessages(activeThreadId)
        if (!isActive) {
          return
        }

        setActiveThread(threadData?.thread || null)
        setMessages(Array.isArray(threadData?.messages) ? threadData.messages : [])

        const threadList = await fetchMessageThreads()
        if (isActive) {
          setThreads(Array.isArray(threadList?.threads) ? threadList.threads : [])
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Unable to refresh conversation.')
        }
      }
    }

    refreshConversation()
    const intervalId = window.setInterval(refreshConversation, POLL_INTERVAL_MS)

    return () => {
      isActive = false
      window.clearInterval(intervalId)
    }
  }, [activeThreadId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  async function handleSelectThread(threadId) {
    setActiveThreadId(threadId)
    setError('')
    setStatusMessage('')
    setMessages([])
    try {
      const threadData = await fetchThreadMessages(threadId)
      setActiveThread(threadData?.thread || null)
      setMessages(Array.isArray(threadData?.messages) ? threadData.messages : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to open the conversation.')
    }
  }

  async function handleSendMessage(event) {
    event.preventDefault()
    if (!activeThreadId || !draft.trim()) {
      return
    }

    setIsSending(true)
    setError('')
    try {
      const response = await sendThreadMessage(activeThreadId, draft.trim())
      setDraft('')
      setStatusMessage('Message sent.')
      if (response?.thread) {
        setActiveThread(response.thread)
      }
      const threadData = await fetchThreadMessages(activeThreadId)
      setMessages(Array.isArray(threadData?.messages) ? threadData.messages : [])
      const threadList = await fetchMessageThreads()
      setThreads(Array.isArray(threadList?.threads) ? threadList.threads : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send your message.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="page-shell messages-shell">
      <section className="messages-layout panel">
        <aside className="messages-sidebar">
          <div className="messages-sidebar-head">
            <p className="eyebrow">Messages</p>
            <h1>Inbox</h1>
            <p className="subcopy">Live conversations for listings stay here and update automatically while you keep the page open.</p>
          </div>

          {isLoading ? (
            <div className="message-empty-state">Loading conversations...</div>
          ) : threads.length === 0 ? (
            <div className="message-empty-state">No conversations yet. Open a listing and tap Message seller.</div>
          ) : (
            <div className="thread-list" role="list">
              {threads.map((thread) => (
                <button
                  type="button"
                  key={thread._id}
                  className={`thread-item ${thread._id === activeThreadId ? 'is-active' : ''}`}
                  onClick={() => handleSelectThread(thread._id)}
                >
                  <div className="thread-item-top">
                    <strong>{thread.other_user_name || 'Conversation'}</strong>
                    <span>{formatTime(thread.latestMessageAt || thread.updatedAt)}</span>
                  </div>
                  <p>{thread.itemTitle || 'Listing conversation'}</p>
                  <small>{thread.latestMessage || 'Tap to open this chat.'}</small>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="messages-panel">
          {activeThread ? (
            <>
              <header className="messages-panel-head">
                <div>
                  <p className="eyebrow">Conversation</p>
                  <h2>{activeThread.other_user_name || 'Chat'}</h2>
                  <p className="subcopy">{activeThread.itemTitle || 'Listing conversation'} {activeThread.itemStatus ? `• ${activeThread.itemStatus}` : ''}</p>
                </div>
                {activeThread.itemImage ? <img src={activeThread.itemImage} alt={activeThread.itemTitle || 'Listing'} className="messages-listing-thumb" /> : null}
              </header>

              <div className="messages-stream" aria-live="polite">
                {messages.length === 0 ? (
                  <div className="message-empty-state">No messages yet. Start the conversation below.</div>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = message.sender_id === user?.id
                    return (
                      <article key={message._id} className={`message-bubble ${isOwnMessage ? 'is-own' : 'is-other'}`}>
                        <div className="message-bubble-meta">
                          <strong>{isOwnMessage ? 'You' : message.sender_name || 'Student'}</strong>
                          <span>{formatTime(message.createdAt)}</span>
                        </div>
                        <p>{message.body}</p>
                      </article>
                    )
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <form className="message-compose" onSubmit={handleSendMessage}>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write a message..."
                  rows={4}
                />
                <div className="message-compose-actions">
                  <span className="message-status" aria-live="polite">{error || statusMessage}</span>
                  <button type="submit" className="button button-primary" disabled={isSending || !draft.trim()}>
                    {isSending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="message-empty-state message-empty-centered">
              {error ? error : 'Select a conversation to start chatting.'}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}