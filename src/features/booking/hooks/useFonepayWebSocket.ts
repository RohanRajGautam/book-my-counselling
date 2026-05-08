'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ConnectionState, WebSocketMessage } from '../types/payment'

const MAX_RETRIES = 5
const RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000]

interface UseFonepayWebSocketOptions {
  transactionId: string | null
  onMessage: (message: WebSocketMessage) => void
  onMaxRetriesExceeded?: () => void
}

interface UseFonepayWebSocketReturn {
  connectionState: ConnectionState
  lastMessage: WebSocketMessage | null
  disconnect: () => void
}

export function useFonepayWebSocket({
  transactionId,
  onMessage,
  onMaxRetriesExceeded,
}: UseFonepayWebSocketOptions): UseFonepayWebSocketReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected')
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const retriesRef = useRef(0)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shouldReconnectRef = useRef(true)

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setConnectionState('disconnected')
  }, [])

  const connect = useCallback(() => {
    if (!transactionId || !shouldReconnectRef.current) return

    const wsBase =
      process.env.NEXT_PUBLIC_WS_URL ||
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
        .replace(/^http/, 'ws')
        .replace('/api/v1', '')

    const url = `${wsBase}/api/v1/payments/ws/${transactionId}`

    setConnectionState('connecting')

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      setConnectionState('connected')
      retriesRef.current = 0
    }

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        setLastMessage(message)
        onMessage(message)
      } catch {
        // ignore malformed messages
      }
    }

    ws.onerror = () => {
      setConnectionState('error')
    }

    ws.onclose = () => {
      wsRef.current = null
      if (!shouldReconnectRef.current) return

      retriesRef.current += 1
      if (retriesRef.current > MAX_RETRIES) {
        setConnectionState('disconnected')
        onMaxRetriesExceeded?.()
        return
      }

      const delay = RETRY_DELAYS[Math.min(retriesRef.current - 1, RETRY_DELAYS.length - 1)]
      setConnectionState('connecting')
      retryTimerRef.current = setTimeout(connect, delay)
    }
  }, [transactionId, onMessage, onMaxRetriesExceeded])

  useEffect(() => {
    if (!transactionId) return
    shouldReconnectRef.current = true
    retriesRef.current = 0
    connect()

    return () => {
      shouldReconnectRef.current = false
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
      wsRef.current?.close()
    }
  }, [transactionId, connect])

  return { connectionState, lastMessage, disconnect }
}
