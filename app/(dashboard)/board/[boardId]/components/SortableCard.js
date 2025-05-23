"use client"

import { GripVertical, MoreVertical } from "lucide-react"
import { useState, useTransition } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SortableCard({ card, columnId, mutateBoard }) {
  const router = useRouter()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id })

  const style = { transform: CSS.Transform.toString(transform), transition }

  const [renameOpen, setRenameOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [pending, start] = useTransition()

  function handleDelete(e) {
    e.preventDefault()
    start(async () => {
      setDeleteOpen(false)
      // optimistic
      mutateBoard((d) => {
        d[columnId] = d[columnId].filter((c) => c.id !== card.id)
      })
      try {
        await fetch(`/api/card/${card.id}/delete`, {
          method: "DELETE",
        })
      } catch (err) {
        // rollback
        mutateBoard((d) => d[columnId].push(card))
        toast.error(`Error deleting card`)
      }
    })
  }

  function handleRename(e) {
    e.preventDefault()
    start(async () => {
      setRenameOpen(false)
      const newTitle = title.trim()
      if (!newTitle) return
      mutateBoard((d) => {
        const t = d[columnId].find((c) => c.id === card.id)
        if (t) t.title = newTitle
      })
      try {
        await fetch(`/api/card/${card.id}/edit`, {
          method: "PATCH",
          body: JSON.stringify({
            newTitle: newTitle,
          }),
        })
      } catch (err) {
        mutateBoard((d) => {
          const t = d[columnId].find((c) => c.id === card.id)
          if (t) t.title = card.title
        })
        toast.error(`Error renaming card`)
      }
    })
  }

  /* UI */
  return (
    <div
      ref={setNodeRef}
      style={style}
      data-card-id={card.id}
      className={`group mb-2 flex items-start gap-2 rounded-md bg-white p-3 shadow-sm border
                transition-all will-change-transform hover:shadow-md touch-manipulation
                ${isDragging ? "opacity-60 border-blue-300 bg-blue-50 scale-105" : "opacity-100 border-gray-200"}`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-gray-400 cursor-grab mt-0.5" />

      <span className="flex-1 break-words text-gray-800 text-sm" data-card-title={card.title}>
        {card.title}
      </span>

      {/* ─── 3-dot menu with better mobile support ─── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1.5 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
            <MoreVertical className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Card options</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setRenameOpen(true)}>Rename</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600 focus:text-red-600" onSelect={() => setDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ───── Rename dialog with mobile improvements ───── */}
      <AlertDialog open={renameOpen} onOpenChange={setRenameOpen}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Rename card</AlertDialogTitle>
            <AlertDialogDescription>Enter a new title and press Save.</AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleRename} className="space-y-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            <div className="flex justify-end gap-2">
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <button
                type="submit"
                disabled={pending}
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* ───── Delete dialog with mobile improvements ───── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this card?</AlertDialogTitle>
            <AlertDialogDescription>This action can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleDelete}>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <button
                type="submit"
                disabled={pending}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:opacity-50 hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
