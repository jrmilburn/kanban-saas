import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../../lib/prisma.js"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],

  callbacks: {
    /**
     * 1) Pack IDs into the JWT and guarantee a personal workspace
     *    (runs after the Prisma Adapter has created / fetched the User row)
     */
    async jwt({ token, user }) {
      // first call right after sign-in → user is defined
      if (user) token.userId = user.id

      if (!token.workspaceId) {
        // try to find an existing membership
        let membership = await prisma.workspaceMember.findFirst({
          where: { userId: token.userId },
          select: { workspaceId: true },
        })

        // none? create personal workspace + membership
        if (!membership) {
          const workspace = await prisma.workSpace.create({
            data: { name: `${user?.name ?? user?.email}'s Space` },
          })
          membership = await prisma.workspaceMember.create({
            data: {
              userId: token.userId,
              workspaceId: workspace.id,
              role: "OWNER",
            },
            select: { workspaceId: true },
          })
        }

        token.workspaceId = membership.workspaceId
      }

      return token
    },

    /**
     * 2) Copy those IDs onto the session object that reaches React / RSC
     */
    async session({ session, token }) {
      session.user.id = token.userId
      session.workspaceId = token.workspaceId
      return session
    },
  },

  pages: {
    signIn: "/login", // optional custom login page
  },
}

/* Export handlers for the App Router */
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
