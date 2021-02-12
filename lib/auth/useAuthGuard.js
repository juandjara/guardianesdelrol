import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { isTokenExpired, getSavedSession } from './authService'
import { useSession } from './UserContext'

export default function useAuthGuard(enabled = true) {
  const router = useRouter()
  const session = useSession()

  useEffect(() => {
    let loggedIn = !!session
    if (!loggedIn) {
      const savedSession = getSavedSession()
      if (savedSession) {
        loggedIn = !isTokenExpired(savedSession.access_token)
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
  }, [router, enabled, session])
}
