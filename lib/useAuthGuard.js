import { useRouter } from 'next/router'
import { useEffect } from 'react'
import isTokenExpired from './isTokenExpired'
import { useSession } from './UserContext'

export default function useAuthGuard(enabled = true) {
  const router = useRouter()
  const { user } = useSession()

  useEffect(() => {
    let loggedIn = !!user
    if (!loggedIn) {
      const savedSession = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')
      if (savedSession.currentSsesion) {
        const token = savedSession.currentSsesion.access_token
        const isExpired = isTokenExpired(token)
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
