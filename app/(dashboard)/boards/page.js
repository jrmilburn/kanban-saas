import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import CreateBoardDialog from "./components/CreateBoardDialog"
import KanbanInfo from "./components/KanbanInfo"
import BoardsList from "./components/BoardsList"

export default async function Boards() {
  const session = await getServerSession(authOptions)

  const boards = await prisma.board.findMany({
    where: { workspaceId: session.workspaceId },
    select: { id: true, title: true, createdAt: true },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Boards</h1>
              <p className="text-gray-500 mt-1">Manage and organize your projects</p>
            </div>
            <div className="flex items-center gap-3">
              <CreateBoardDialog workspaceId={session.workspaceId} />
            </div>
          </div>
        </header>

        {/* Kanban Information Section */}
        <KanbanInfo />

        {/* Boards List with Search */}
        <BoardsList boards={boards} workspaceId={session.workspaceId} />
      </div>
    </div>
  )
}
