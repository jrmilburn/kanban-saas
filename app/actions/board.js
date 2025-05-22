'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "../../lib/prisma"
import { toast } from "sonner"

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

    toast.success(`${board.title} created`)

    revalidatePath('/boards');
    redirect(`/board/${board.id}`);
}