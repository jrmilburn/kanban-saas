// app/api/card/[cardId]/delete/route.js
import { NextResponse } from 'next/server'
import { getWebSocketServer } from '@/app/api/ws/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function DELETE(_req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { cardId } = await params

  // 1) fetch the card to get its columnId & boardId
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    select: {
      columnId: true,
      column: { select: { boardId: true } },
    },
  })
  if (!card) {
    return new NextResponse('Not found', { status: 404 })
  }

  const { columnId } = card
  const boardId = card.column.boardId

  // 2) delete the card
  await prisma.card.delete({ where: { id: cardId } })

  // 3) broadcast CARD_DELETED over WebSocket
  const wss = getWebSocketServer()
  console.log('🔈 Broadcasting CARD_DELETED?', !!wss, { cardId, columnId })
  if (wss) {
    for (const sock of wss.clients) {
      if (sock.readyState === sock.OPEN) {
        sock.send(
          JSON.stringify({
            type: 'CARD_DELETED',
            payload: { id: cardId, columnId },
            boardId,
            username: session.user.name,
          })
        )
      }
    }
  }

  // 4) respond with JSON so your client can confirm
  return NextResponse.json({
    success: true,
    payload: { id: cardId, columnId },
    username: session.user.name,
  })
}
