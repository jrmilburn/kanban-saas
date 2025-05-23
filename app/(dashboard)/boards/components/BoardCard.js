"use client"

import { useState } from "react"
import Link from "next/link"
import { LayoutGrid, Clock, ArrowUpRight, MoreVertical, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteBoard } from "@/app/actions/board"

export default function BoardCard({ board }) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await deleteBoard({ boardId: board.id })

      toast.success("Board deleted successfully")
      setDeleteOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete board. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="group relative flex flex-col h-40 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden">
        {/* Board Content - Clickable Link */}
        <Link href={`/board/${board.id}`} className="flex-1 p-4 flex flex-col">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-8 w-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {board.title}
              </h2>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>

          <div className="mt-auto flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {board.createdAt ? new Date(board.createdAt).toLocaleDateString() : "Recently created"}
          </div>
        </Link>

        {/* Actions Menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-8 w-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="h-4 w-4 text-gray-600" />
                <span className="sr-only">Board options</span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/board/${board.id}`} className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  Open Board
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 flex items-center gap-2"
                onSelect={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Color Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Board</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{board.title}&quot;? This action cannot be undone and will permanently remove
              the board and all its columns and cards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete Board"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
