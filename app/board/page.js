import { prisma } from '../../lib/prisma'
import KanbanBoard from './components/KanbanBoard'

export default async function BoardPage() {
  const board = await prisma.board.findFirst({
    include: { Column: { 
      orderBy: { order: 'asc' },
      include: { Card: true }
     } },
  })

  return <KanbanBoard board={board} />
}