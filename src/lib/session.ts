import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "./auth"

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/login')
  }
  
  return session
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    redirect('/')
  }
  
  return session
} 