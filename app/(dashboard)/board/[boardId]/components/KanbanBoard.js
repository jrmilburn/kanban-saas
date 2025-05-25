"use client"

import { useState, useMemo } from "react"
import { DndContext, PointerSensor, DragOverlay, useSensor, useSensors, pointerWithin } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { GripVertical, MoreVertical, ArrowLeft } from "lucide-react"
import Column from "./Column"
import AddColumnDialog from "./AddColumn"
import { toast } from "sonner"
import Link from "next/link"
import useBoardSocket from "@/lib/useWs"

export default function Board({ board }) {
  /* ---------- build initial column → cards map ---------- */
  const initialCards = useMemo(() => {
    const map = {}
    board.Column.forEach((c) => (map[c.id] = c.Card))
    return map
  }, [board.Column])

  const [columns, setColumns] = useState(initialCards)
  const [activeCard, setActiveCard] = useState(null)

  /* ---------- websocket integration ---------- */
  useBoardSocket(board.id, (msg) => {
    if (msg.type === "CARD_MOVED") {
      const { id, oldColumnId, destColumnId, newOrder } = msg.payload
      const { username } = msg

      mutateBoard((draft) => {
        // remove
        const idx = draft[oldColumnId].findIndex((c) => c.id === id)
        const [moved] = draft[oldColumnId].splice(idx, 1)

        // update metadata
        moved.columnId = destColumnId
        moved.order = newOrder

        // insert
        draft[destColumnId].splice(newOrder, 0, moved)
      })

      toast.success(`Card moved by ${username}`)
    } else if (msg.type === "CARD_CREATED") {
      const { id, columnId, order, title } = msg.payload
      const { username } = msg
      mutateBoard((draft) => {
        // ensure array exists
        if (!draft[columnId]) draft[columnId] = []
        // insert at the correct index
        draft[columnId].splice(order, 0, { id, columnId, order, title })
      })
      toast.success(`"${title}" created by ${username}`)
    } else if (msg.type === "CARD_DELETED") {
      const { id, columnId } = msg.payload
      const { username } = msg

      mutateBoard((draft) => {
        draft[columnId] = draft[columnId].filter((c) => c.id !== id)
      })

      toast.success(`Card deleted by ${username}`)
    } else if (msg.type === "CARD_RENAMED") {
      const { id, columnId, newTitle } = msg.payload
      const { username } = msg

      mutateBoard((draft) => {
        const card = draft[columnId].find((c) => c.id === id)
        if (card) card.title = newTitle
      })

      toast.success(`Card renamed by ${username}`)
    }
  })

  /* ---------- DnD sensors ---------- */
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  /* ---------- helpers ---------- */
  const columnOf = (cardId) => Object.keys(columns).find((cid) => columns[cid].some((c) => c.id === cardId))

  /* ---------- drag handlers ---------- */
  function handleDragStart({ active }) {
    const colId = columnOf(active.id)
    setActiveCard(columns[colId].find((c) => c.id === active.id))
  }

  async function handleDragEnd({ active, over }) {
    setActiveCard(null)
    if (!over) return

    const srcCol = columnOf(active.id)
    const dstCol = over.data.current?.columnId /* drop on column body */ ?? columnOf(over.id) /* drop on another card */
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
      const response = await fetch("/api/card/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: active.id,
          oldColumnId: srcCol,
          destColumnId: dstCol,
          newOrder: insertIdx,
        }),
      })
    } catch {
      toast.error("Move failed — reloading")
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
    <div className="flex flex-col h-full w-full">
      {/* Board Header with improved Navigation */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center shadow-sm">
        <Link
          href="/boards"
          className="mr-3 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Back to boards"
        >
          <ArrowLeft className="h-4 w-4 text-gray-700" />
        </Link>
        <h1 className="text-lg font-bold truncate">{board.title || "Kanban Board"}</h1>
      </div>

      {/* Board Content with improved scrolling */}
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto overscroll-x-contain touch-pan-x pb-6 pt-2 px-2 md:px-4">
          <div className="flex gap-4 min-h-[calc(100vh-180px)] pb-4">
            {board.Column.map((col) => (
              <Column key={col.id} column={col} cards={columns[col.id]} mutateBoard={mutateBoard} />
            ))}
            <AddColumnDialog boardId={board.id} mutateBoard={mutateBoard} />
          </div>
        </div>

        <DragOverlay dropAnimation={{ duration: 150 }}>
          {activeCard && (
            <div className="mb-2 flex items-center justify-between gap-2 rounded-lg bg-white p-3 shadow-lg opacity-90 border border-gray-200 max-w-[250px]">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <span className="font-medium line-clamp-2">{activeCard.title}</span>
              </div>
              <MoreVertical className="h-4 w-4 text-gray-400 shrink-0" />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
