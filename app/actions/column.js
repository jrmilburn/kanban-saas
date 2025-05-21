'use server'

import { prisma } from "../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function addColumn({ boardId, title }) {

    const session = await getServerSession(authOptions);
    if (!session) redirect('login');

    const order = await prisma.column.count({ where: { boardId } })

    const newColumn = await prisma.column.create({ data: { boardId, title, order }})
    revalidatePath(`/board`)
    return newColumn;
}

export async function renameColumn({ title, columnId }) {

    const session = await getServerSession(authOptions);
    if (!session) redirect('login');

    const updateColumn = await prisma.column.update({
        where: { id: columnId },
        data: { title: title }
    })
  revalidatePath(`/board`)


    return updateColumn;

}

export async function deleteColumn({ columnId }) {

    const session = await getServerSession(authOptions);
    if (!session) redirect('login');

    await prisma.card.deleteMany({
        where: { columnId }
    })
    const deletedColumn = await prisma.column.delete({ where:{ id: columnId } });
  revalidatePath(`/board`)

    return (deletedColumn);
}