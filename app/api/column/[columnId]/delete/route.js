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

  const { columnId } = await params

  const cards = await prisma.card.deleteMany({ where: { columnId: columnId }});
  const column = await prisma.column.delete({ where: { id: columnId }});

  // 3) broadcast CARD_DELETED over WebSocket
  const wss = getWebSocketServer()
  console.log('🔈 Broadcasting COL_DELETED?', !!wss, { columnId })
  if (wss) {
    for (const sock of wss.clients) {
      if (sock.readyState === sock.OPEN) {
        sock.send(
          JSON.stringify({
            type: 'COL_DELETED',
            payload: { id: columnId },
            username: session.user.name,
          })
        )
      }
    }
  }

  // 4) respond with JSON so your client can confirm
  return NextResponse.json({
    success: true,
    payload: { id: columnId },
    username: session.user.name,
  })
}
