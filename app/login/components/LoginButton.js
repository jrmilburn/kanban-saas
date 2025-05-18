'use client'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function LoginButton() {
  return (
    <button onClick={() => signIn('github')} className='cursor-pointer border-2'>
      Sign in with GitHub
    </button>
  )
}
