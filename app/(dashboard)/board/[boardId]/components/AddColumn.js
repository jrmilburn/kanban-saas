"use client"

import { useState, useTransition } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export default function AddColumnDialog({ boardId, mutateBoard }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [pending, start] = useTransition()
  const router = useRouter()

  async function handleCreate(e) {
    e.preventDefault()
    const name = title.trim()
    if (!name) return

    start(async () => {
      setOpen(false)
      setTitle("")

      /* 🔹 optimistic: add temp column with empty card list */
      const tempId = "temp-" + Date.now()
      mutateBoard((d) => {
        d[tempId] = []
      })

      try {
        const response = await fetch("/api/column/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ boardId, title: name }),
        })

        const col = await response.json()

        mutateBoard((d) => {
          d[col.id] = []
          delete d[tempId]
        })
        toast.success("New column created")
      } catch (err) {
        /* rollback & hard refresh */
        mutateBoard((d) => {
          delete d[tempId]
        })
        toast.error("Unable to create column")
        router.refresh()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* trigger button */}
      <DialogTrigger asChild>
        <div className="h-full flex items-start">
          <button className="h-12 min-w-[280px] sm:min-w-[300px] shrink-0 rounded-lg bg-gray-100 border border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            Add Column
          </button>
        </div>
      </DialogTrigger>

      {/* dialog */}
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New column</DialogTitle>
          <DialogDescription>Create a column in this board.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Column name" required />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              {pending ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
