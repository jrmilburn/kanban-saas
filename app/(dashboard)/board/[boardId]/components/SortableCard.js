'use client'

import { GripVertical, MoreVertical, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { deleteCard, renameCard } from '@/app/actions/card'   // ← your server actions
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRouter } from 'next/navigation'

export default function SortableCard({ card, columnId, mutateBoard }) {
    const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id })

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
      mutateBoard(d => {
        d[columnId] = d[columnId].filter(c => c.id !== card.id)
      })
      try {
        await deleteCard({ cardId: card.id })
      } catch (err) {
        // rollback
        mutateBoard(d => d[columnId].push(card))
      }
    })
  }

  function handleRename(e) {
    e.preventDefault()
    start(async () => {
      setRenameOpen(false)
      const newTitle = title.trim()
      if (!newTitle) return
      mutateBoard(d => {
        const t = d[columnId].find(c => c.id === card.id)
        if (t) t.title = newTitle
      })
      try {
        await renameCard({ cardId: card.id, newTitle: newTitle })
      } catch (err) {
        mutateBoard(d => {
          const t = d[columnId].find(c => c.id === card.id)
          if (t) t.title = card.title
        })
      }
    })
  }

  /* UI */
  return (
    <div
      ref={setNodeRef}
      style={style}
      data-card-id={card.id}
      className={`group mb-2 flex items-start gap-2 rounded bg-white p-2 shadow
                  transition-opacity will-change-transform
                  ${isDragging ? 'opacity-60' : 'opacity-100'}`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-gray-400 cursor-grab" />

      <span className="flex-1 break-words" data-card-title={card.title}>
        {card.title}
      </span>

      {/* ─── 3-dot hover menu ─── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="invisible p-1 group-hover:visible">
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onSelect={() => setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ───── Rename dialog ───── */}
      <AlertDialog open={renameOpen} onOpenChange={setRenameOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename card</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new title and press&nbsp;Save.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleRename} className="space-y-4">
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2">
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <button
                type="submit"
                disabled={pending}
                className="rounded bg-indigo-600 px-3 py-1 text-sm text-white disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* ───── Delete dialog (same structure) ───── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this card?</AlertDialogTitle>
            <AlertDialogDescription>
              This action can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleDelete}>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <button
                type="submit"
                disabled={pending}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:opacity-50"
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
