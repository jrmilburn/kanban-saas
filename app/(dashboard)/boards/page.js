import { prisma } from "@/lib/prisma"
import { Link } from "next/navigation"
import { auth } from "@/app/api/auth/[...nextauth]/route"

export default async function Boards() {

    const session = await auth();
    console.log(session);

    const boards = await prisma.board.findMany({
        where: { workspaceId: session.workspaceId },
        select: { id: true, title: true}
    })

    return (
  <ul>
    {boards.map(b => (
      <Link key={b.id} href={`/board/${b.id}`} className="block p-2 hover:bg-gray-100">
        {b.title}
      </Link>
    ))}
  </ul>
)

}