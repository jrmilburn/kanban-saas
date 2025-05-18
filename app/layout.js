import './globals.css'            // <-- your global styles
import NextAuthProvider from '@/lib/SessionProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import SignOut from './signout'

export const metadata = { title: 'Kanban SaaS' }

export default async function RootLayout({ children }) {
  // grab the initial session on the server

  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <html lang="en">
      <body>
        <NextAuthProvider session={session}>{children}</NextAuthProvider>
        <SignOut />
      </body>
    </html>
  )
}
