// app/api/card/create/route.js
import { NextResponse } from 'next/server'
import { getWebSocketServer } from '../../../api/ws/route'
import { prisma } from '../../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(req) {
  const { columnId, title } = await req.json()

  // 1) ensure user is signed in
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // 2) compute the new order
  const order = await prisma.card.count({ where: { columnId } })

  // 3) create the card
  const card = await prisma.card.create({
    data: { columnId, title, order },
    select: { id: true, columnId: true, order: true, title: true },
  })

  // 4) look up the boardId
  const col = await prisma.column.findUnique({
    where: { id: columnId },
    select: { boardId: true },
  })
  const boardId = col?.boardId

  // 5) prepare the payload
  const payload = { ...card }

  // 6) broadcast over WebSocket
  const wss = getWebSocketServer()
  console.log('🔈 Broadcasting CARD_CREATED?', !!wss, payload)
  if (wss) {
    for (const sock of wss.clients) {
      if (sock.readyState === sock.OPEN) {
        sock.send(JSON.stringify({
          type: 'CARD_CREATED',
          payload,
          boardId,
          username: session.user.name,
        }))
      }
    }
  }

  // 7) respond with the created card
  return NextResponse.json({
    success: true,
    payload,
    username: session.user.name,
  })
}
