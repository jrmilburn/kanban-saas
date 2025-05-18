'use client'
import { signOut } from "next-auth/react"

export default function SignOut() {

    return <button className='border-2 p-2' onClick={signOut}>Sign Out</button>
    

}