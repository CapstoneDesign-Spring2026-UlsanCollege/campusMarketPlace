import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchMessageThreads, fetchThreadMessages, openMessageThread, sendThreadMessage, markThreadRead } from '../services/api'
import { getAuthToken, getAuthUser } from '../services/auth'
import { t } from '../services/i18n'

function MessageStatus({ status }) {
  if (!status) return null
  if (status === 'seen') {
    return (
      <span className="msg-status msg-status-seen" title="Seen">
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
          <path d="M1 5l3 3 5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 5l3 3 5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    )
  }
  if (status === 'delivered') {
    return (
      <span className="msg-status msg-status-delivered" title="Delivered">
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
          <path d="M1 5l3 3 5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 5l3 3 5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    )
  }
  return (
    <span className="msg-status msg-status-sent" title="Sent">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M1 5l3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  )
}

function UserAvatar({ name, src }) {
  const [imgError, setImgError] = useState(false)
  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name || 'User'}
        className="thread-avatar"
        onError={() => setImgError(true)}
      />
    )
  }
  return (
    <span className="thread-avatar thread-avatar-initials" aria-label={name || 'User'}>
      {initials}
    </span>
  )
}

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

export default function Messages({ language = 'en' }) {
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
  const draftFromItem = searchParams.get('draft') || ''

  const user = useMemo(() => {
    return getAuthUser()
  }, [])

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      navigate('/login', { replace: true, state: { message: t(language, 'navbar.signOutBody') } })
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
          if (draftFromItem) {
            setDraft(draftFromItem)
          }
          // mark as read for the current user so unread count updates
          try {
            await markThreadRead(nextThread._id)
            const updatedList = await fetchMessageThreads()
            if (isActive) {
              setThreads(Array.isArray(updatedList?.threads) ? updatedList.threads : [])
            }
          } catch (e) {
            // non-fatal
          }
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
  }, [navigate, itemId, draftFromItem])

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

  useEffect(() => {
    if (!statusMessage) return undefined
    const id = setTimeout(() => setStatusMessage(''), 3000)
    return () => clearTimeout(id)
  }, [statusMessage])

  function handleTextareaKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage(event)
    }
  }

  async function handleSelectThread(threadId) {
    setActiveThreadId(threadId)
    setError('')
    setStatusMessage('')
    setMessages([])
    try {
      const threadData = await fetchThreadMessages(threadId)
      setActiveThread(threadData?.thread || null)
      setMessages(Array.isArray(threadData?.messages) ? threadData.messages : [])
      // mark this thread read now that the user actively opened it
      try {
        const readResp = await markThreadRead(threadId)
        if (readResp?.thread) {
          setActiveThread(readResp.thread)
        }
        const threadList = await fetchMessageThreads()
        setThreads(Array.isArray(threadList?.threads) ? threadList.threads : [])
      } catch (e) {
        // ignore read-mark failures
      }
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
      <section className={`messages-layout panel${activeThread ? ' has-active' : ''}`}>
        <aside className="messages-sidebar">
          <div className="messages-sidebar-head">
            <p className="eyebrow">{t(language, 'messages.messages')}</p>
            <h1>{t(language, 'messages.inbox')}</h1>
            <p className="subcopy">{t(language, 'messages.subcopy')}</p>
          </div>

          {isLoading ? (
            <div className="message-empty-state">{t(language, 'messages.loadingConversations')}</div>
          ) : threads.length === 0 ? (
            <div className="message-empty-state">{t(language, 'messages.noConversations')}</div>
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
                    <UserAvatar
                      name={thread.other_user_name}
                      src={thread.other_user_avatar || thread.other_user_avatar_url || thread.otherUserAvatar}
                    />
                    <div className="thread-item-info">
                      <strong>{thread.other_user_name || t(language, 'messages.chat')}</strong>
                      <div className="thread-item-meta">
                        <span>{formatTime(thread.latestMessageAt || thread.updatedAt)}</span>
                        {thread.unreadCount > 0 ? (
                          <span className="thread-unread-badge" aria-label={`${thread.unreadCount} unread messages`}>{thread.unreadCount}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <p>{thread.itemTitle || t(language, 'messages.listingConversation')}</p>
                  <small>{thread.latestMessage || t(language, 'messages.noMessagesYet')}</small>
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
                  <button
                    type="button"
                    className="messages-back-btn"
                    onClick={() => { setActiveThreadId(''); setActiveThread(null); setMessages([]) }}
                  >
                    ← {t(language, 'messages.inbox')}
                  </button>
                  <p className="eyebrow">{t(language, 'messages.conversation')}</p>
                  <h2>{activeThread.other_user_name || t(language, 'messages.chat')}</h2>
                  <p className="subcopy">{activeThread.itemTitle || t(language, 'messages.listingConversation')} {activeThread.itemStatus ? `• ${activeThread.itemStatus}` : ''}</p>
                </div>
                {activeThread.itemImage ? <img src={activeThread.itemImage} alt={activeThread.itemTitle || 'Listing'} className="messages-listing-thumb" /> : null}
              </header>

              <div className="messages-stream" aria-live="polite">
                {messages.length === 0 ? (
                  <div className="message-empty-state">{t(language, 'messages.noMessagesYet')}</div>
                ) : (
                  messages.map((message, index) => {
                    const isOwnMessage = message.sender_id === user?.id
                    const prevMessage = messages[index - 1]
                    const isFirstInGroup = !prevMessage || prevMessage.sender_id !== message.sender_id
                    return (
                      <article key={message._id} className={`message-bubble ${isOwnMessage ? 'is-own' : 'is-other'}`}>
                        {!isOwnMessage && isFirstInGroup && (
                          <div className="msg-sender">{message.sender_name || t(language, 'messages.student')}</div>
                        )}
                        <p>{message.body}</p>
                        <div className="msg-footer">
                          <time className="msg-time">{formatTime(message.createdAt)}</time>
                          {isOwnMessage && <MessageStatus status={message.status} />}
                        </div>
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
                  onKeyDown={handleTextareaKeyDown}
                  placeholder={t(language, 'messages.writeMessage')}
                  rows={3}
                />
                <div className="message-compose-actions">
                  {error ? (
                    <span className="message-status is-error" aria-live="polite">{error}</span>
                  ) : statusMessage ? (
                    <span className="message-status is-success" aria-live="polite">{statusMessage}</span>
                  ) : (
                    <span className="message-compose-hint">Enter to send · Shift+Enter for new line</span>
                  )}
                  <button type="submit" className="button button-primary" disabled={isSending || !draft.trim()}>
                    {isSending ? t(language, 'messages.sending') : t(language, 'messages.send')}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="message-empty-state message-empty-centered">
              {error ? error : t(language, 'messages.selectConversation')}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}