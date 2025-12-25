'use server'

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'

export async function authenticate(date: string) {
  try {
    // We use redirect: false to allow the client to handle the success state (animations)
    // before reloading/redirecting.
    await signIn('credentials', { date, redirect: false })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false }
        default:
          return { success: false }
      }
    }
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' })
}
