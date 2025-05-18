import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const member = await prisma.workspaceMember.findFirst({
        where: { userId: user.id },
      })

      if (!member) {
        const workspace = await prisma.workSpace.create({
          data: { name: `${user.name ?? user.email}'s Space` },
        })
        await prisma.workspaceMember.create({
          data: {
            userId: user.id,
            workspaceId: workspace.id,
            role: 'OWNER',
          },
        })
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) token.userId = user.id

      if (!token.workspaceId) {
        const membership = await prisma.workspaceMember.findFirst({
          where: { userId: token.userId },
          select: { workspaceId: true },
        })
        token.workspaceId = membership?.workspaceId
      }

      return token
    },
    async session({ session, token }) {
      session.user.id = token.userId
      session.workspaceId = token.workspaceId
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}

// Export GET and POST handlers for App Router API
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

