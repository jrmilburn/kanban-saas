'use client'

import { useState, useMemo } from 'react'
import {
  DndContext,
  PointerSensor,
  DragOverlay,
  useSensor,
  useSensors,
  pointerWithin,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { GripVertical, MoreVerticalIcon } from 'lucide-react'
import Column from './Column'
import AddColumnDialog from './AddColumn'
import { toast } from 'sonner'
import { moveCard } from '@/app/actions/card'
import useBoardSocket from '@/lib/useWs'

export default function Board({ board }) {
  /* ---------- build initial column → cards map ---------- */

  useBoardSocket(board.id, msg => {
    if (msg.type !== 'CARD_MOVED') return
    const { id, oldColumnId, destColumnId, newOrder } = msg.payload

    console.log(oldColumnId);
    console.log(destColumnId);

    mutateBoard(draft => {
      // remove
      const idx = draft[oldColumnId].findIndex(c => c.id === id)
      const [moved] = draft[oldColumnId].splice(idx, 1)

      // update metadata
      moved.columnId = destColumnId
      moved.order = newOrder

      // insert
      draft[destColumnId].splice(newOrder, 0, moved)
    })
  })

  const initialCards = useMemo(() => {
    const map = {}
    board.Column.forEach((c) => (map[c.id] = c.Card))
    return map
  }, [board.Column])

  const [columns, setColumns] = useState(initialCards)
  const [activeCard, setActiveCard] = useState(null)

  /* ---------- DnD sensors ---------- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  /* ---------- helpers ---------- */
  const columnOf = (cardId) =>
    Object.keys(columns).find((cid) =>
      columns[cid].some((c) => c.id === cardId),
    )

  /* ---------- drag handlers ---------- */
  function handleDragStart({ active }) {
    const colId = columnOf(active.id)
    setActiveCard(columns[colId].find((c) => c.id === active.id))
  }

  async function handleDragEnd({ active, over }) {
    setActiveCard(null)
    if (!over) return

    const srcCol = columnOf(active.id)
    const dstCol =
      over.data.current?.columnId /* drop on column body */ ??
      columnOf(over.id)            /* drop on another card */
    if (!dstCol) return

    /* --- reorder within same column --- */
    if (srcCol === dstCol) {
      const oldIdx = columns[srcCol].findIndex((c) => c.id === active.id)
      const newIdx = columns[dstCol].findIndex((c) => c.id === over.id)
      if (oldIdx !== newIdx) {
        setColumns((p) => ({
          ...p,
          [srcCol]: arrayMove(p[srcCol], oldIdx, newIdx),
        }))
      }
      return
    }

    /* --- move across columns (optimistic) --- */
    const srcArr = [...columns[srcCol]]
    const dstArr = [...columns[dstCol]]
    const [moved] = srcArr.splice(
      srcArr.findIndex((c) => c.id === active.id),
      1,
    )
    const insertIdx = dstArr.findIndex((c) => c.id === over.id) + 1
    dstArr.splice(insertIdx, 0, moved)

    setColumns((p) => ({ ...p, [srcCol]: srcArr, [dstCol]: dstArr }))

    try {
      await fetch('/api/card/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: active.id, oldColumnId: srcCol,destColumnId: dstCol, newOrder: insertIdx, }),
      })
    } catch {
      toast.error('Move failed — reloading')
    }
  }

  /* ---------- helper for children ---------- */
  const mutateBoard = (fn) =>
    setColumns((prev) => {
      const draft = structuredClone(prev)
      fn(draft)
      return draft
    })

  /* ---------- render ---------- */
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pr-4">
        {board.Column.map((col) => (
          <Column
            key={col.id}
            column={col}
            cards={columns[col.id]}
            mutateBoard={mutateBoard}
          />
        ))}
        <AddColumnDialog boardId={board.id} mutateBoard={mutateBoard} />
      </div>

      <DragOverlay dropAnimation={{ duration: 150 }}>
        {activeCard && (
          <div className="mb-2 flex items-center justify-between gap-2 rounded bg-white p-2 shadow-lg opacity-90">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-gray-400" />
              <span>{activeCard.title}</span>
            </div>
            <MoreVerticalIcon className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
