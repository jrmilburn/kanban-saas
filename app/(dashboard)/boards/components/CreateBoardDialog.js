'use client'

import { useState, useTransition } from "react"
import { createBoard } from "@/app/actions/board"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function CreateBoardDialog({ workspaceId }) {

    const [open, setOpen] = useState(false);
    const [pending, start] = useTransition();
    const [title, setTitle] = useState('');

    const handleCreateBoard = async () => {
        await createBoard({workspaceId: workspaceId, title: title})
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="rounded bg-indigo-600 px-3 py-1 text-sm text-white">+ New board</button>
            </DialogTrigger>
            <DialogContent className="space-y-4">
                        <DialogHeader>
                          <DialogTitle>Create board</DialogTitle>
                        </DialogHeader>
                <form
                    onSubmit={handleCreateBoard}
    
                    className="space-y-3"
                >
                    <input 
                        name="title"
                        placeholder="Board name"
                        className="w-full rounded border px-2 py-1"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded px-3 py-1 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={pending}
                            className="rounded bg-indigo-600 px-3 py-1 text-sm text-white disabled:opacity-50"
                        >
                            {pending ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )

}