"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export default function SignOut() {
  return (
    <button
      onClick={() => signOut()}
      className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-sm transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  )
}
