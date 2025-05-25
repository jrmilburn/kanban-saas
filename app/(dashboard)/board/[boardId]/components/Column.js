"use client"

import { useState, useTransition } from "react"
import { MoreVertical, Plus } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SortableCard from "./SortableCard"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Column({ column, cards, mutateBoard }) {
  const router = useRouter()
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { columnId: column.id },
  })

  /* ───── Add-card state ───── */
  const [cardTitle, setCardTitle] = useState("")
  const [creating, startCreate] = useTransition()
  const [isAddingCard, setIsAddingCard] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    const title = cardTitle.trim()
    if (!title) return
    setCardTitle("")
    setIsAddingCard(false)

    startCreate(async () => {
      try {
        await fetch("/api/card/create", {
          method: "POST",
          body: JSON.stringify({
            columnId: column.id,
            title,
          }),
        })
      } catch (err) {
        toast.error(`Could not create new card`)
        router.refresh()
      }
    })
  }

  /* ───── Rename / Delete dialog state ───── */
  const [renameOpen, setRenameOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [newTitle, setNewTitle] = useState(column.title)
  const [pending, start] = useTransition()

  /* rename handler */
  function handleRename(e) {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    start(async () => {
      setRenameOpen(false)
      mutateBoard((d) => {
        d[column.id].title = title
      })
      try {
        await fetch(`/api/column/${column.id}/edit`, {
          method: "PATCH",
          body: JSON.stringify({
            newTitle: title,
          }),
        })
        toast.success(`Column renamed successfully`)
      } catch (err) {
        mutateBoard((d) => {
          d[column.id].title = column.title
        })
        toast.error(`Column could not be renamed`)
        router.refresh()
      }
    })
  }

  /* delete handler */
  function handleDelete(e) {
    e.preventDefault()
    start(async () => {
      setDeleteOpen(false)
      try {
        await fetch(`/api/column/${column.id}/delete`, {
          method: "DELETE",
        })
        toast.success(`Column deleted successfully`)
      } catch (err) {
        mutateBoard((d) => {
          d[column.id] = backup
          d[column.id].title = column.title
        })
        toast.error(`Column could not be deleted`)
        router.refresh()
      }
    })
  }

  return (
    <div
      ref={setNodeRef}
      className={`w-[280px] sm:w-[300px] shrink-0 rounded-lg bg-gray-50 shadow-sm border transition-colors
                ${isOver ? "bg-blue-50 border-blue-200" : "border-gray-200"}`}
    >
      {/* ───── Column header with 3-dot menu ───── */}
      <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-800 truncate">{column.title}</h2>
          <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{cards?.length || 0}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded p-1 hover:bg-gray-200 transition-colors">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setRenameOpen(true)}>Rename</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:text-red-600" onSelect={() => setDeleteOpen(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ───── Cards list with improved scrolling ───── */}
      <div className="p-2 max-h-[calc(100vh-180px)] overflow-y-auto overscroll-y-contain">
        <SortableContext id={column.id} items={cards?.map((c) => c.id) || []} strategy={verticalListSortingStrategy}>
          {cards?.map((card) => (
            <SortableCard key={card.id} card={card} columnId={column.id} mutateBoard={mutateBoard} />
          ))}
        </SortableContext>

        {cards?.length === 0 && (
          <div className="rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-500">Drop cards here</div>
        )}

        {/* ───── Add-card input with improved mobile experience ───── */}
        {isAddingCard ? (
          <form onSubmit={handleCreate} className="mt-2">
            <Input
              className="w-full mb-2"
              placeholder="Enter card title..."
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              disabled={creating}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex-1"
                disabled={creating}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="mt-2 w-full flex items-center justify-center gap-1 rounded-md border border-dashed border-gray-300 p-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add a card
          </button>
        )}
      </div>

      {/* ───── Rename dialog ───── */}
      <AlertDialog open={renameOpen} onOpenChange={setRenameOpen}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Rename column</AlertDialogTitle>
            <AlertDialogDescription>Enter a new title for this column.</AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleRename} className="space-y-4">
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
            <div className="flex justify-end gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
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

      {/* ───── Delete dialog ───── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this column?</AlertDialogTitle>
            <AlertDialogDescription>
              Cards inside will also be removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleDelete}>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" type="submit" disabled={pending}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
