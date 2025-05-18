import { prisma } from '../../../../lib/prisma'
import KanbanBoard from './components/KanbanBoard'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function BoardPage({ params }) {

  const session = await getServerSession(authOptions);
  if (!session) redirect('/login')

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