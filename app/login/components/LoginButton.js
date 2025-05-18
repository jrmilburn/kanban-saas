'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginButton() {
  const { data: session, status } = useSession()
  const router = useRouter()

  /* If the user is already logged in, jump straight to /boards */
  useEffect(() => {
    if (status === 'authenticated') router.replace('/boards')
  }, [status, router])

  return (
    <button
      className="cursor-pointer rounded border px-4 py-2"
      onClick={() => signIn('github', { callbackUrl: '/boards' })}
    >
      Sign in with GitHub
    </button>
  )
}
