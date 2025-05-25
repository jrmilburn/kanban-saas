// app/api/card/create/route.js
import { NextResponse } from 'next/server'
import { getWebSocketServer } from '../../../api/ws/route'
import { prisma } from '../../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(req) {
  const { boardId, title } = await req.json()

  // 1) ensure user is signed in
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // 2) compute the new order
  const order = await prisma.column.count({ where: { boardId } })

  // 3) create the card
  const column = await prisma.column.create({
    data: { boardId, title, order },
    select: { id: true, boardId: true, order: true, title: true },
  })

  // 5) prepare the payload
  const payload = { ...column }

  // 6) broadcast over WebSocket
  const wss = getWebSocketServer()
  console.log('🔈 Broadcasting COL_CREATED?', !!wss, payload)
  if (wss) {
    for (const sock of wss.clients) {
      if (sock.readyState === sock.OPEN) {
        sock.send(JSON.stringify({
          type: 'COL_CREATED',
          payload,
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
