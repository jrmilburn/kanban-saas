// app/api/card/move/route.js
import { NextResponse } from 'next/server'
import { getWebSocketServer } from '../../../api/ws/route'
import { prisma } from '../../../../lib/prisma'

export async function POST(req) {
  const { cardId, oldColumnId,destColumnId, newOrder } = await req.json()

  // 1) update DB exactly as before
  await prisma.$transaction([
    prisma.card.update({
      where: { id: cardId },
      data: { columnId: destColumnId, order: newOrder },
    }),
    prisma.card.updateMany({
      where: {
        columnId: destColumnId,
        order: { gte: newOrder },
        id: { not: cardId },
      },
      data: { order: { increment: 1 } },
    }),
  ])

  // 2) figure out oldColumnId & boardId
  const newCard = await prisma.card.findUnique({
    where: { id: cardId },
    select: { columnId: true, column: { select: { boardId: true }} },
  })

  const payload = { id: cardId, oldColumnId, destColumnId, newOrder }

  const wss = getWebSocketServer()
  console.log('🔈 Broadcasting on WS?', !!wss, payload)
  if (wss) {
    for (const sock of wss.clients) {
      if (sock.readyState === sock.OPEN) {
        sock.send(JSON.stringify({ type: 'CARD_MOVED', payload, boardId: newCard.column.boardId }))
      }
    }
  }

  return NextResponse.json({ success: true, payload })
}
