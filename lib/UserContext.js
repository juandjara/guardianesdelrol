import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { getSavedSession, isTokenExpired } from './authService'

function getURLParameter(name, url) {
  if (!url) url = window.location.href
  var regex = new RegExp('[?&#]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

const UserContext = createContext(supabase.auth.session())

export function UserContextProvider(props) {
  const [session, setSession] = useState(null)
  const router = useRouter()

  useEffect(() => {
    function handleFocus() {
      const savedSession = getSavedSession()
      if (isTokenExpired(savedSession.access_token)) {
        supabase.auth.refreshSession()
      }
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  useEffect(() => {
    const savedSession = supabase.auth.session()
    setSession(savedSession)

    const type = window.location.hash && getURLParameter('type')
    if (type) {
      router.push(`/settings?type=${type}`)
    }

    const { data: listener } = supabase.auth.onAuthStateChange((eventKey, newSession) => {
      console.info('[UserContext] Auth event: ', eventKey)
      setSession(newSession)
    })
    return () => listener.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
