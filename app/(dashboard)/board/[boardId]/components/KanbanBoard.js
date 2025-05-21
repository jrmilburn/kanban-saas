'use client'

import { useState, useMemo } from 'react'
import {
  DndContext,
  PointerSensor,
  DragOverlay,
  useSensor,
  useSensors,
  pointerWithin,
  useDroppable,          // ← stays at top level
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { GripVertical, MoreVerticalIcon } from 'lucide-react'
import { moveCard, createCard } from '@/app/actions/card'
import Column from './Column'
import AddColumnDialog from './AddColumn'

/* ─────────────── Board root ─────────────── */

export default function Board({ board }) {
  /**  columnId → array<card>  */
  const initial = useMemo(() => {
    const map = {}
    board.Column.forEach((c) => (map[c.id] = c.Card))
    return map
  }, [board.Column])

  const [columns, setColumns] = useState(initial)
  const [activeCard, setActiveCard] = useState(null)

  /* Pointer sensor */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  /* Helpers */
  const columnOf = (cardId) =>
    Object.keys(columns).find((cid) => columns[cid].some((c) => c.id === cardId))

  /* Drag life-cycle */
  function handleDragStart({ active }) {
    const colId = columnOf(active.id)
    setActiveCard(columns[colId].find((c) => c.id === active.id))
  }

  async function handleDragEnd({ active, over }) {
    setActiveCard(null)
    if (!over) return

    const srcCol = columnOf(active.id)
    const dstCol = over.data.current?.columnId
    if (!dstCol) return

    /* ─ Re-order within same column ─ */
    if (srcCol === dstCol) {
      const oldIdx = columns[srcCol].findIndex((c) => c.id === active.id)
      const newIdx = columns[dstCol].findIndex((c) => c.id === over.id)
      if (oldIdx === newIdx) return

      setColumns((prev) => ({
        ...prev,
        [srcCol]: arrayMove(prev[srcCol], oldIdx, newIdx),
      }))
      return
    }

    /* ─ Move across columns ─ */
    const srcItems = [...columns[srcCol]]
    const dstItems = [...columns[dstCol]]
    const [moved] = srcItems.splice(
      srcItems.findIndex((c) => c.id === active.id),
      1,
    )
    const dstIdx = dstItems.findIndex((c) => c.id === over.id)
    dstItems.splice(dstIdx === -1 ? dstItems.length : dstIdx, 0, moved)

    setColumns((prev) => ({
      ...prev,
      [srcCol]: srcItems,
      [dstCol]: dstItems,
    }))

    /* TODO: persist order via server action / API */
    await moveCard({ cardId: active.id, destColumnId: over.id, newOrder: dstItems.length - 1});
  }

  /* shared helper for optimistic board mutation */
  const mutateBoard = (mutator) =>
    setColumns((prev) => {
      const draft = structuredClone(prev)
      mutator(draft)
      return draft
  })

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pr-4">
        {board.Column.map((col) => (
          <Column key={col.id} column={col} cards={columns[col.id]} setColumns={setColumns} mutateBoard={mutateBoard} />
        ))}
        <AddColumnDialog boardId={board.id} mutateBoard={mutateBoard} />
      </div>

      <DragOverlay dropAnimation={{ duration: 150 }}>
        {activeCard ? (
          <div className="mb-2 flex items-center justify-between gap-2 rounded bg-white p-2 shadow-lg opacity-90">
            <div className='flex gap-2 items-center'>
            <GripVertical className="h-4 w-4 shrink-0 text-gray-400" />
            <span>{activeCard.title}</span>
            </div>
            <MoreVerticalIcon className='h-4 w-4 shrink-0 text-gray-400' />

          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
