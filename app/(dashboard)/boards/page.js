import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CreateBoardDialog from "./components/CreateBoardDialog";

export default async function Boards() {

    const session = await getServerSession(authOptions);
    console.log(session);

    const boards = await prisma.board.findMany({
        where: { workspaceId: session.workspaceId },
        select: { id: true, title: true}
    })

    return (
      <div className="mx-auto max-w-lg space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Your boards</h1>
          <CreateBoardDialog workspaceId={session.workspaceId} />
        </div>
        <ul className="space-y-2">
          {boards.map(b => (
            <li key={b.id}>
              <Link href={`/board/${b.id}`} className="block rounded bg-gray-100 p-3 hover:bg-gray-200">
                {b.title}
              </Link>
            </li>
          ))}
          {boards.length === 0 && (
            <li className="rounded bg-yellow-50 p-3 text-sm text-yellow-800">
              No boards yet – create your first!
            </li>
          )}
        </ul>
      </div>
    )

}