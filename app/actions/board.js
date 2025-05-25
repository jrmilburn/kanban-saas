'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "../../lib/prisma"

export async function createBoard({ workspaceId, title}) {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    const board = await prisma.board.create({
        data: {
            title: title,
            workspaceId: workspaceId,
                  Column: {
                  create: [
                    { title: 'To Do',  order: 0 },
                    { title: 'Doing',  order: 1 },
                    { title: 'Done',   order: 2 },
                  ],
                },
        }
    })

    return board;
}

export async function deleteBoard({boardId}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  // Get all columns for the board
  const columns = await prisma.column.findMany({
    where: { boardId }
  })

  // Get all column IDs
  const columnIds = columns.map(col => col.id)

  // Perform the deletion in a transaction
  await prisma.$transaction([
    // Delete all cards in these columns
    prisma.card.deleteMany({
      where: { columnId: { in: columnIds } }
    }),
    // Delete all columns in this board
    prisma.column.deleteMany({
      where: { boardId }
    }),
    // Delete the board itself
    prisma.board.delete({
      where: { id: boardId }
    })
  ])
}