'use server'

import { prisma } from "../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function moveCard({ cardId, destColumnId, newOrder }) {
    await prisma.$transaction([
        prisma.card.update({
            where: { id: cardId },
            data: { columnId: destColumnId, order: newOrder }
        }),
        prisma.card.updateMany({
            where: {
                columnId: destColumnId,
                order: { gte: newOrder },
                id: { not: cardId }
            },
            data: { order: { increment: 1 } }
        })
    ])
}

export async function createCard({ columnId, title }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login');

  const order = await prisma.card.count({ where: { columnId } })
  const card = await prisma.card.create({
    data: { title, columnId, order },
  })
  revalidatePath(`/board`)
  return card
}

export async function renameCard({ cardId, newTitle }) {

    const session = await getServerSession(authOptions);
    if(!session) redirect('/login');

    const updatedCard = await prisma.card.update({
        where: { id: cardId },
        data: { title: newTitle }
    })

    revalidatePath('/board');
    return updatedCard;

}

export async function deleteCard({ cardId }) {

    const session = getServerSession(authOptions);
    if(!session) redirect('/login')

    const deletedCard = await prisma.card.delete({
        where: { id: cardId }
    })

    return deletedCard

}
  