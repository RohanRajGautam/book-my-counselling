'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ConnectionState, WebSocketMessage } from '../types/payment'

const MAX_RETRIES = 5
const RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000]

interface UseFonepayWebSocketOptions {
  transactionId: string | null
  onMessage: (message: WebSocketMessage) => void
  /** Called when the connection is permanently lost (max retries exceeded). */
  onDisconnected?: () => void
}

interface UseFonepayWebSocketReturn {
  connectionState: ConnectionState
  disconnect: () => void
}

export function useFonepayWebSocket({
  transactionId,
  onMessage,
  onDisconnected,
}: UseFonepayWebSocketOptions): UseFonepayWebSocketReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected')

  const wsRef = useRef<WebSocket | null>(null)
  const retriesRef = useRef(0)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shouldReconnectRef = useRef(true)

  // Keep stable refs to callbacks so connect() doesn't need them as deps
  const onMessageRef = useRef(onMessage)
  const onDisconnectedRef = useRef(onDisconnected)
  useEffect(() => { onMessageRef.current = onMessage }, [onMessage])
  useEffect(() => { onDisconnectedRef.current = onDisconnected }, [onDisconnected])

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

    // Build WS URL from the API base URL
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    const wsBase = apiBase.replace(/^http/, 'ws')
    const url = `${wsBase}/payments/ws/${transactionId}`

    setConnectionState('connecting')
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      setConnectionState('connected')
      retriesRef.current = 0
    }

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data as string)
        onMessageRef.current(message)
      } catch {
        // ignore malformed frames
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
        onDisconnectedRef.current?.()
        return
      }

      const delay = RETRY_DELAYS[Math.min(retriesRef.current - 1, RETRY_DELAYS.length - 1)]
      setConnectionState('connecting')
      retryTimerRef.current = setTimeout(connect, delay)
    }
  }, [transactionId]) // connect only re-creates when transactionId changes

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

  return { connectionState, disconnect }
}
