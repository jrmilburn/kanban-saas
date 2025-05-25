import "./globals.css"
import NextAuthProvider from "@/lib/SessionProvider"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { Toaster } from "sonner"
import Providers from "./providers"
import Header from "../components/Header"

export const metadata = { title: "Kanban SaaS" }

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className="w-full h-screen bg-gray-50">
        <NextAuthProvider session={session}>
          <Providers>
            <div className="flex flex-col h-full">
              {/* Global Header */}
              {session && <Header session={session} />}

              {/* Main Content */}
              <main className="flex-1 overflow-hidden">{children}</main>
            </div>
          </Providers>
        </NextAuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
