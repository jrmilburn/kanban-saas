import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import CreateBoardDialog from "./components/CreateBoardDialog"
import BoardCard from "./components/BoardCard"
import { LayoutGrid, Search, Plus } from "lucide-react"

export default async function Boards() {
  const session = await getServerSession(authOptions)

  const boards = await prisma.board.findMany({
    where: { workspaceId: session.workspaceId },
    select: { id: true, title: true, createdAt: true },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Boards</h1>
              <p className="text-gray-500 mt-1">Manage and organize your projects</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search boards..."
                  className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <CreateBoardDialog workspaceId={session.workspaceId} />
            </div>
          </div>
        </header>

        {/* Board Grid */}
        {boards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}

            {/* Create New Board Card */}
            <CreateBoardDialog
              workspaceId={session.workspaceId}
              trigger={
                <div className="flex flex-col h-40 rounded-lg border border-dashed border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Create New Board</span>
                </div>
              }
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <LayoutGrid className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No boards yet</h3>
            <p className="text-gray-500 max-w-md mb-6">
              Create your first board to start organizing your projects with columns and cards.
            </p>
            <CreateBoardDialog workspaceId={session.workspaceId} />
          </div>
        )}
      </div>
    </div>
  )
}
