// app/api/card/[cardId]/edit/route.js
import { NextResponse } from 'next/server'
import { getWebSocketServer } from '@/app/api/ws/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { cardId } = params
  const { newTitle } = await req.json()

  if (typeof newTitle !== 'string' || !newTitle.trim()) {
    return new NextResponse('Invalid title', { status: 400 })
  }

  // 1) load the existing card to get its columnId and boardId
  const existing = await prisma.card.findUnique({
    where: { id: cardId },
    select: {
      columnId: true,
      column: { select: { boardId: true } },
      title: true,
    },
  })
  if (!existing) {
    return new NextResponse('Not found', { status: 404 })
  }

  // 2) update the title
  const updated = await prisma.card.update({
    where: { id: cardId },
    data: { title: newTitle.trim() },
    select: { id: true, columnId: true, order: true, title: true },
  })

  const boardId = existing.column.boardId

  // 3) broadcast CARD_RENAMED over WebSocket
  const wss = getWebSocketServer()
  console.log('🔈 Broadcasting CARD_RENAMED?', !!wss, { id: cardId, newTitle })
  if (wss) {
    for (const sock of wss.clients) {
      if (sock.readyState === sock.OPEN) {
        sock.send(
          JSON.stringify({
            type: 'CARD_RENAMED',
            payload: { id: cardId, columnId: existing.columnId, newTitle: updated.title },
            boardId,
            username: session.user.name,
          })
        )
      }
    }
  }

  // 4) respond with the updated card
  return NextResponse.json({
    success: true,
    payload: updated,
    username: session.user.name,
  })
}
