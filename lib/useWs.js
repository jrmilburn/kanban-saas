import { useEffect } from 'react'

export default function useWs(boardId, onMessage) {
  useEffect(() => {
    const ws = new WebSocket(`wss://kanban.joemilburn.com.au/api/ws?boardId=${boardId}`)
    ws.onmessage = (e) => onMessage(JSON.parse(e.data))
    ws.onopen    = () => console.log('WS connected')
    ws.onerror   = (err) => console.error('WS error', err)
    return () => ws.close()
  }, [boardId, onMessage])
}
