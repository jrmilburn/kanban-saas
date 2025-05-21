'use client'

import { useState, useTransition } from 'react'
import { addColumn } from '@/app/actions/column'   // ← adjust path if needed
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

/**
 * Props
 * ─────
 * boardId      – string       (slug of the current board)
 * mutateBoard  – fn(draft)    (helper from parent to update local state)
 */
export default function AddColumnDialog({ boardId, mutateBoard }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [pending, start] = useTransition()
  const router = useRouter()

  async function handleCreate(e) {
    e.preventDefault()
    const name = title.trim()
    if (!name) return

    start(async () => {
      setOpen(false)
      setTitle('')

      /* 🔹 optimistic: add temp column with empty card list */
      const tempId = 'temp-' + Date.now()
      mutateBoard((d) => {
        d[tempId] = { title: name, Card: [] }
      })

      try {
        const col = await addColumn({ boardId, title: name })
        mutateBoard((d) => {
          d[col.id] = []
          delete d[tempId]
        })
      } catch (err) {
        /* rollback & hard refresh */
        mutateBoard((d) => { delete d[tempId] })
        router.refresh()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* trigger button */}
      <DialogTrigger asChild>
        <button className="h-full min-w-[6rem] shrink-0 rounded-lg bg-gray-200/70 px-3 py-2 text-sm hover:bg-gray-300">
          + Column
        </button>
      </DialogTrigger>

      {/* dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New column</DialogTitle>
          <DialogDescription>Create a column in this board.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Column name"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded bg-indigo-600 px-3 py-1 text-sm text-white disabled:opacity-50"
            >
              {pending ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
