"use client"

import { useState } from "react"
import { createBoard } from "@/app/actions/board"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Plus, Layout, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CreateBoardDialog({ workspaceId, trigger }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")

  const handleCreateBoard = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("Board name is required")
      return
    }

    setPending(true)
    setError("")

    try {
      const board = await createBoard({ workspaceId, title: title.trim() })
      toast.success("Board created successfully")
      setOpen(false)
      setTitle("")

      // Navigate to the new board
      if (board?.id) {
        router.push(`/board/${board.id}`)
      } else {
        router.refresh()
      }
    } catch (err) {
      setError("Failed to create board. Please try again.")
      toast.error("Failed to create board")
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          setTitle("")
          setError("")
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <button className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            New Board
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-blue-600" />
            Create New Board
          </DialogTitle>
          <DialogDescription>
            Give your board a name to get started. You can add columns and cards after creation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateBoard} className="space-y-4 mt-2">
          <div>
            <label htmlFor="board-title" className="block text-sm font-medium text-gray-700 mb-1">
              Board Name
            </label>
            <input
              id="board-title"
              name="title"
              placeholder="Enter board name..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={pending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Board"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
