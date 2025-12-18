'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function authenticate(date: string) {
  if (date === '29-06-2025') { 
    // Set cookie for 30 days
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    cookies().set('session', 'authenticated', { 
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    return { success: true }
  }
  return { success: false }
}

export async function logout() {
  cookies().delete('session')
  revalidatePath('/')
}
