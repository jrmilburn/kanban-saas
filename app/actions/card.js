'use server'

import { prisma } from "../../lib/prisma"

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
    const column = await prisma.column.findUnique({
        where: {
            id: columnId
        },
        select: {
            Card: true
        }
    })

    const cardCount = column.Card.length;
    
    await prisma.card.create({
        data: {
            columnId: columnId,
            title: title,
            order: cardCount
        }
    })
}
  