import { redirect } from 'next/navigation'
import { prisma } from '../../../lib/prisma'

export default async function BoardIndex() {
  
  const first = await prisma.board.findFirst({
    select: { id: true },
  })
  if (first) redirect(`/board/${first.id}`)
  redirect('/boards')

  if (first) redirect(`/board/${first.id}`)
  redirect('/boards')  // fall-back if no boards exist
}