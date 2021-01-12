import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSession } from './UserContext'

export default function useAuthGuard(enabled = true) {
  const router = useRouter()
  const { user } = useSession()

  useEffect(() => {
    let loggedIn = !!user
    if (!loggedIn) {
      const savedSession = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')
      if (savedSession.expiresAt) {
        const expireTime = savedSession.expiresAt * 1000
        const isExpired = expireTime < Date.now()
        loggedIn = !isExpired
      }
    }
    if (enabled && !loggedIn) {
      router.replace(
        router.asPath,
        {
          pathname: '/login',
          query: {
            next: router.asPath
          }
        },
        { shallow: true }
      )
    }
  }, [router, enabled, user])
}
