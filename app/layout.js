import './globals.css'            // <-- your global styles
import NextAuthProvider from '@/lib/SessionProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import SignOut from './signout'
import { Toaster } from 'sonner'
import Providers from './providers'

export const metadata = { title: 'Kanban SaaS' }

export default async function RootLayout({ children }) {
  // grab the initial session on the server

  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <html lang="en">
      <body className='w-full h-screen'>
        
          <NextAuthProvider session={session}>
            <Providers>
              {children}
            </Providers>
            </NextAuthProvider>
          <SignOut />
          <Toaster position='bottom-right' />
      </body>
    </html>
  )
}
