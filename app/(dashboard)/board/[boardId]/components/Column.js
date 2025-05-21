'use client'

import { useState, useTransition } from 'react'
import { GripVertical, MoreVertical } from 'lucide-react'
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
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import {
  renameColumn,
  deleteColumn,
  addColumn, // used only if you create new columns here
} from '@/app/actions/column'            // ← adjust path
import { createCard } from '@/app/actions/card'
import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import SortableCard from './SortableCard'
import { useRouter } from 'next/navigation'

export default function Column({ column, cards, setColumns, mutateBoard }) {
  const router = useRouter()
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { columnId: column.id },
  })

  /* ───── Add-card state ───── */
  const [cardTitle, setCardTitle] = useState('')
  const [creating, startCreate] = useTransition()

  async function handleCreate(e) {
    e.preventDefault()
    const title = cardTitle.trim()
    if (!title) return
    setCardTitle('')

    startCreate(async () => {
      // optimistic push
      const tempCard = {
        id: 'temp-' + Date.now(),
        title,
        order: cards.length,
        columnId: column.id,
      }
      mutateBoard((d) => {
        d[column.id].push(tempCard)
      })

      try {
        const created = await createCard({ columnId: column.id, title })
        mutateBoard((d) => {
          const colArr = d[column.id]
          const idx = colArr.findIndex((c) => c.id === tempCard.id)
          if (idx !== -1) colArr[idx] = created
        })
      } catch (err) {
        // rollback
        mutateBoard((d) => {
          d[column.id] = d[column.id].filter((c) => c.id !== tempCard.id)
        })
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
        await renameColumn({ columnId: column.id, title })
      } catch (err) {
        mutateBoard((d) => {
          d[column.id].title = column.title
        })
        router.refresh()
      }
    })
  }

  /* delete handler */
  function handleDelete(e) {
    e.preventDefault()
    start(async () => {
      setDeleteOpen(false)
      const backup = cards
      mutateBoard((d) => {
        delete d[column.id]
      })
      try {
        await deleteColumn({ columnId: column.id })
      } catch (err) {
        mutateBoard((d) => {
          d[column.id] = backup
          d[column.id].title = column.title
        })
        router.refresh()
      }
    })
  }

  console.log('CARDS', cards);

  return (
    <div
      ref={setNodeRef}
      className={`w-64 shrink-0 rounded-lg p-3 shadow-inner transition-colors
                  ${isOver ? 'bg-indigo-50' : 'bg-gray-100'}`}
    >
      {/* ───── Column header with 3-dot menu ───── */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{column.title}</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded p-1 hover:bg-gray-200">
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
      </div>

      {/* ───── Cards list ───── */}
      <SortableContext
        id={column.id}
        items={cards?.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        {cards?.map((card) => (
          <SortableCard
            key={card.id}
            card={card}
            columnId={column.id}
            mutateBoard={mutateBoard}
          />
        ))}
      </SortableContext>

      {cards?.length === 0 && (
        <p className="rounded bg-gray-200/50 p-2 text-center text-xs text-gray-500">
          Drop cards here
        </p>
      )}

      {/* ───── Add-card input ───── */}
      <form onSubmit={handleCreate} className="mt-2 flex items-center gap-2">
        <input
          className="w-full rounded border px-2 py-1 text-sm"
          placeholder="Add card…"
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
          disabled={creating}
        />
        <button
          type="submit"
          className="h-8 w-8 rounded bg-indigo-600 text-white disabled:opacity-50"
          disabled={creating}
        >
          +
        </button>
      </form>

      {/* ───── Rename dialog ───── */}
      <AlertDialog open={renameOpen} onOpenChange={setRenameOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename column</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new title for this column.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleRename} className="space-y-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
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

      {/* ───── Delete dialog ───── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this column?</AlertDialogTitle>
            <AlertDialogDescription>
              Cards inside will also be removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleDelete}>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700"
                type="submit"
                disabled={pending}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
