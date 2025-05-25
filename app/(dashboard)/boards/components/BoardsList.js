"use client"

import { useState, useMemo } from "react"
import { Search, LayoutGrid, Plus, X } from "lucide-react"
import BoardCard from "./BoardCard"
import CreateBoardDialog from "./CreateBoardDialog"

export default function BoardsList({ boards, workspaceId }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter boards based on search term
  const filteredBoards = useMemo(() => {
    if (!searchTerm.trim()) {
      return boards
    }

    return boards.filter((board) => board.title.toLowerCase().includes(searchTerm.toLowerCase().trim()))
  }, [boards, searchTerm])

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search boards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-10 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            {filteredBoards.length === 0 ? (
              <span>No boards found matching &quot;{searchTerm}&quot;</span>
            ) : (
              <span>
                {filteredBoards.length} board{filteredBoards.length !== 1 ? "s" : ""} found
                {filteredBoards.length !== boards.length && ` out of ${boards.length}`}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Board Grid */}
      {boards.length === 0 ? (
        // No boards at all - show empty state
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <LayoutGrid className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No boards yet</h3>
          <p className="text-gray-500 max-w-md mb-6">
            Create your first board to start organizing your projects with columns and cards.
          </p>
          <CreateBoardDialog workspaceId={workspaceId} />
        </div>
      ) : filteredBoards.length === 0 ? (
        // No search results - show search empty state
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No boards found</h3>
          <p className="text-gray-500 max-w-md mb-6">
            No boards match your search for &quot;{searchTerm}&quot;. Try a different search term or create a new board.
          </p>
          <div className="flex gap-3">
            <button
              onClick={clearSearch}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Search
            </button>
            <CreateBoardDialog workspaceId={workspaceId} />
          </div>
        </div>
      ) : (
        // Show filtered boards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBoards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}

          {/* Create New Board Card - only show when not searching or when there are results */}
          {(!searchTerm || filteredBoards.length > 0) && (
            <CreateBoardDialog
              workspaceId={workspaceId}
              trigger={
                <div className="flex flex-col h-40 rounded-lg border border-dashed border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Create New Board</span>
                </div>
              }
            />
          )}
        </div>
      )}
    </div>
  )
}
