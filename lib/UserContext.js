import { useAlert } from '@/lib/AlertContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { fetchProfile } from './authService'
import isTokenExpired from './isTokenExpired'

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
  const [profile, setProfile] = useState(null)
  const { setAlert } = useAlert()
  const router = useRouter()

  async function handleProfileFetch(id) {
    if (!id) {
      return
    }
    const { data, error } = await fetchProfile(id)
    if (error) {
      console.error(error)
      setAlert(error.message)
    } else {
      setProfile(data)
    }
  }

  useEffect(() => {
    const savedSession = supabase.auth.session()
    setSession(savedSession)

    const type = window.location.hash && getURLParameter('type')
    if (type) {
      router.push(`/settings?type=${type}`)
    }

    handleProfileFetch(savedSession?.user?.id)
    const { data: listener } = supabase.auth.onAuthStateChange((type, newSession) => {
      if (newSession && type === 'USER_UPDATED') {
        newSession.user = supabase.auth.user()
      }
      if (newSession?.user?.id !== session?.user?.id || type === 'USER_UPDATED') {
        handleProfileFetch(newSession?.user?.id)
      }
      setSession(newSession)
    })
    return () => listener.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let context = { setProfile }
  if (session && !isTokenExpired(session.access_token)) {
    context = {
      ...session,
      user: { ...session.user, ...profile },
      setProfile
    }
  }

  return <UserContext.Provider value={context} {...props} />
}

export function useSession() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useSession must be used within a UserContextProvider.`)
  }

  return context
}
