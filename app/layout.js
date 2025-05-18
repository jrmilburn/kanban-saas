import './globals.css'            // <-- your global styles
import { SessionProvider } from 'next-auth/react'

export const metadata = { title: 'Kanban SaaS' }

export default async function RootLayout({ children }) {
  // grab the initial session on the server
  const session = await auth()

  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
