export function SOCKET(client, request, server, context) {
  if (!globalThis.__MY_WS_SERVER__) {
    globalThis.__MY_WS_SERVER__ = server
    console.log('✅ Stored WebSocketServer on globalThis')
  }

    const url = new URL(request.url, 'http://localhost')
  const boardId = url.searchParams.get('boardId')
  console.log('client connectd on ', boardId);

  client.on('close', () => {
    console.log('❌ Client disconnected')
  })
}

/** helper that always returns the same server instance */
export function getWebSocketServer() {
  return globalThis.__MY_WS_SERVER__
}