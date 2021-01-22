import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { getSavedSession, isTokenExpired } from './authService'

const UserContext = createContext(supabase.auth.session())

export function UserContextProvider(props) {
  const [session, setSession] = useState(null)
  const router = useRouter()

  useEffect(function listenWindowFocus() {
    async function handleFocus() {
      const savedSession = getSavedSession()
      if (isTokenExpired(savedSession?.access_token)) {
        const { data } = await supabase.auth.refreshSession()
        setSession(data)
      }
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  useEffect(function listenSession() {
    const savedSession = supabase.auth.session()
    setSession(savedSession)

    const { data: listener } = supabase.auth.onAuthStateChange((eventKey, newSession) => {
      console.info('[UserContext] Auth event: ', eventKey)
      setSession(newSession)
    })
    return () => listener.unsubscribe()
  }, [])

  useEffect(
    function readHash() {
      const q = new URLSearchParams(router.asPath)
      const type = q.get('type')
      const token = q.get('/#access_token')
      if (type && router.pathname === '/') {
        if (type === 'recovery') {
          router.push({
            pathname: 'recovery',
            query: { form: 'pass' },
            hash: `t=${token}`
          })
        } else {
          router.push('/settings')
        }
      }
      // if (router.pathname === '/' && q.get('type') && q.get('/#access_token')) {
      //   router.push('/settings')
      // }
    },
    [session, router]
  )

  const context = isTokenExpired(session?.access_token) ? null : session
  return <UserContext.Provider value={context} {...props} />
}

export function useSession() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useSession must be used within a UserContextProvider.`)
  }

  return context
}
