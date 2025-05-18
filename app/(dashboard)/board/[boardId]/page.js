import { prisma } from '../../../../lib/prisma'
import KanbanBoard from './components/KanbanBoard'

export const dynamic = 'force-dynamic';

export default async function BoardPage({ params }) {

  const boardId = params.boardId;

  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: { Column: { 
      orderBy: { order: 'asc' },
      include: { Card: true }
     } },
  })

  return <KanbanBoard board={board} />
}