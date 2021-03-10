import { supabase } from '@/lib/db-client/supabase'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { getSavedSession, isTokenExpired } from './authService'

const AuthContext = createContext(supabase.auth.session())

export function AuthProvider(props) {
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
      console.info('[AuthContext] Auth event: ', eventKey)
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
          router.push('/dashboard')
        }
      }
    },
    [session, router]
  )

  const context = isTokenExpired(session?.access_token) ? null : session
  return <AuthContext.Provider value={context} {...props} />
}

export function useSession() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useSession must be used within a AuthProvider.`)
  }

  return context
}
