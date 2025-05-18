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
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { moveCard, createCard } from '@/app/actions/card'

/* ─────────────── Sortable card ─────────────── */

function SortableCard({ card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    animateLayoutChanges: ({ isSorting }) => isSorting,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-2 flex items-start gap-2 rounded bg-white p-2 shadow
                  transition-transform duration-200 ease-in-out will-change-transform
                  ${isDragging ? 'opacity-60' : 'opacity-100'}`}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-gray-400" />
      <span>{card.title}</span>
    </div>
  )
}

/* ─────────────── Droppable column ─────────────── */

function Column({ column, cards }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { columnId: column.id }, // makes columnId available in `over.data.current`
  })

  const [title, setTitle] = useState('');

  const handleCreate = () => {
    createCard({ columnId: column.id, title: title})
  }

  return (
    <div
      ref={setNodeRef}
      className={`w-64 shrink-0 rounded-lg p-3 shadow-inner transition-colors
                  ${isOver ? 'bg-indigo-50' : 'bg-gray-100'}`}
    >
      <h2 className="mb-3 text-sm font-semibold">{column.title}</h2>

      <SortableContext
        id={column.id}
        items={cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        {cards.map((card) => (
          <SortableCard key={card.id} card={card} />
        ))}
      </SortableContext>

      {cards.length === 0 && (
        <p className="rounded bg-gray-200/50 p-2 text-center text-xs text-gray-500">
          Drop cards here
        </p>
      )}

      <form onSubmit={handleCreate} className='flex items-center'>
        <input
          className="mb-2 w-full rounded border px-2 py-1 text-sm"
          placeholder="Add card…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type='submit' className='w-8 h-8 cursor-pointer'>
          +
        </button>
      </form>
    </div>
  )
}

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pr-4">
        {board.Column.map((col) => (
          <Column key={col.id} column={col} cards={columns[col.id]} />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 150 }}>
        {activeCard ? (
          <div className="mb-2 flex items-start gap-2 rounded bg-white p-2 shadow-lg opacity-90">
            <GripVertical className="h-4 w-4 shrink-0 text-gray-400" />
            <span>{activeCard.title}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
