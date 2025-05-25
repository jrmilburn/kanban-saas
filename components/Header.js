"use client"

import Link from "next/link"
import { LayoutGrid, User } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import SignOut from "./SignOut"

export default function Header({ session }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/boards" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <LayoutGrid className="h-4 w-4" />
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">Kanban.jm</span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block">{session?.user?.name || session?.user?.email || "User"}</span>
                  <span className="sm:hidden">Menu</span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-gray-500 border-b">{session?.user?.email}</div>
                <DropdownMenuItem asChild>
                  <Link href="/boards" className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4" />
                    My Boards
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <SignOut />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
